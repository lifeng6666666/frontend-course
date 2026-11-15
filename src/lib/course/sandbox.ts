/**
 * 实验沙箱工具：
 * - PROBE：注入到每个实验 iframe 的探针脚本，把控制台输出与网络请求上报给课程页面。
 * - buildReactDoc / buildTailwindDoc：为浏览器内转译的 React 实验生成完整 HTML。
 */

const PROBE = `<script>
(function(){
  var BP=__COURSE_BASE_PATH__;
  var send=function(m){try{parent.postMessage(m,'*')}catch(e){}};
  var fix=function(u){return (BP && typeof u==='string' && u.charAt(0)==='/' && u.charAt(1)!=='/') ? BP+u : u;};
  function fmt(args){try{
    return Array.prototype.map.call(args,function(x){
      if(typeof x==='string')return x;
      try{return JSON.stringify(x)}catch(e){return String(x)}
    }).join(' ');
  }catch(e){return ''}}
  ['log','info','warn','error'].forEach(function(k){
    var orig=console[k].bind(console);
    console[k]=function(){send({__lab:1,kind:'log',level:k,text:fmt(arguments)});orig.apply(null,arguments)};
  });
  window.addEventListener('error',function(e){
    send({__lab:1,kind:'log',level:'error',text:(e.message||'脚本错误')+(e.lineno?('（第 '+e.lineno+' 行）'):'')});
  });
  window.addEventListener('unhandledrejection',function(e){
    send({__lab:1,kind:'log',level:'error',text:'未处理的 Promise 拒绝：'+e.reason});
  });
  if(window.fetch){
    var of=window.fetch.bind(window);
    window.fetch=function(input,init){
      var url=typeof input==='string'?input:(input&&input.url)||'';
      if(typeof input==='string') input=fix(input);
      var method=((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
      var t0=performance.now();
      return of(input,init).then(function(res){
        send({__lab:1,kind:'net',entry:{url:url,method:method,status:res.status,dur:Math.round(performance.now()-t0),type:(res.headers.get('content-type')||'').split(';')[0]||''}});
        return res;
      },function(err){
        send({__lab:1,kind:'net',entry:{url:url,method:method,status:0,dur:Math.round(performance.now()-t0),type:'failed'}});
        throw err;
      });
    };
  }
  if(window.EventSource){
    var OE=window.EventSource;
    window.EventSource=function(url,cfg){ return new OE(fix(url),cfg); };
    ['CONNECTING','OPEN','CLOSED'].forEach(function(k){ window.EventSource[k]=OE[k]; });
    window.EventSource.prototype=OE.prototype;
  }
})();
</script>`;

/** 把探针注入 HTML 文档的 <head> 里；没有 <head> 就整体前置 */
export function injectProbe(html: string): string {
  const bp =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/[^/]*$/, "")
      : "";
  const probe = PROBE.replace("__COURSE_BASE_PATH__", JSON.stringify(bp));
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => m + probe);
  }
  return probe + html;
}

const CDN_FAIL_HINT = `<script>
(function(){
  window.addEventListener('error',function(e){
    if(e && e.target && e.target.tagName==='SCRIPT'){
      console.error('脚本加载失败：'+ (e.target.src ? e.target.src.slice(0,80) : '内联脚本') );
    } else if(e){
      window.__lastErr = (e.error && e.error.stack) || (e.message + ' @line ' + e.lineno);
    }
  },true);
  setTimeout(function(){
    var root=document.getElementById('root');
    if(root && root.children.length===0){
      root.innerHTML='<p style="font-family:system-ui;padding:24px;color:#b45309">CDN 运行时加载失败或代码尚未渲染，请检查网络后重新运行。</p>';
    }
  },12000);
})();
</script>`;


/**
 * 把实验代码中的裸导入改写为 CDN 全址。
 * 教学代码保持裸导入（与真实工程一致，由构建工具解析）；沙箱内由 Babel standalone
 * 执行，其对 import map 中带查询串的映射解析不稳定，因此生成文档时直接替换为完整
 * URL——等价于打包器（Vite）所做的模块解析工作。
 */
function resolveBareImports(body: string): string {
  const map: [RegExp, string][] = [
    [/from\s*["']react-dom\/client["']/g, 'from "https://esm.sh/react-dom@19.1.0/client"'],
    [/from\s*["']react-router-dom["']/g, 'from "https://esm.sh/react-router-dom@6.30.0?deps=react@19.1.0,react-dom@19.1.0"'],
    [/from\s*["']react["']/g, 'from "https://esm.sh/react@19.1.0"'],
  ];
  let out = body;
  for (const [re, rep] of map) out = out.replace(re, rep);
  return out;
}

/** React 浏览器内转译沙箱（React 19 + Babel standalone，经 esm.sh / unpkg CDN） */

export function buildReactDoc(body: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<script type="importmap">
{"imports":{
  "react":"https://esm.sh/react@19.1.0",
  "react/jsx-runtime":"https://esm.sh/react@19.1.0/jsx-runtime",
  "react-dom/client":"https://esm.sh/react-dom@19.1.0/client",
  "react-router-dom":"https://esm.sh/react-router-dom@6.30.0?deps=react@19.1.0,react-dom@19.1.0"
}}
</script>
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;margin:20px;color:#27272a;line-height:1.6}
  #root:empty::after{content:"（React 尚未渲染任何内容）";color:#a1a1aa;font-size:13px}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-type="module" data-presets="react">
${resolveBareImports(body)}
</script>
${CDN_FAIL_HINT}
</body>
</html>`;
}

/** React + Tailwind Play CDN 沙箱（第 9 章样式实验用） */
export function buildTailwindDoc(body: string, dark = false): string {
  return `<!DOCTYPE html>
<html lang="zh-CN"${dark ? ' class="dark"' : ""}>
<head>
<meta charset="UTF-8" />
<script type="importmap">
{"imports":{
  "react":"https://esm.sh/react@19.1.0",
  "react/jsx-runtime":"https://esm.sh/react@19.1.0/jsx-runtime",
  "react-dom/client":"https://esm.sh/react-dom@19.1.0/client",
  "react-router-dom":"https://esm.sh/react-router-dom@6.30.0?deps=react@19.1.0,react-dom@19.1.0"
}}
</script>
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.26.4/polyfill.min.js"></script>
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>tailwind.config={darkMode:'class'}</script>
<style>body{margin:16px}</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-type="module" data-presets="react">
${resolveBareImports(body)}
</script>
${CDN_FAIL_HINT}
</body>
</html>`;
}
