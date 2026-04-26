// import React, { useEffect, useRef, useState, useMemo } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import "katex/dist/katex.min.css";

// import Prism from "prismjs";
// import "prismjs/themes/prism.css";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-java";
// import "prismjs/components/prism-c";
// import "prismjs/components/prism-cpp";
// import "prismjs/components/prism-csharp";
// import "prismjs/components/prism-go";
// import "prismjs/components/prism-rust";
// import "prismjs/components/prism-sql";
// import "prismjs/components/prism-bash";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-yaml";
// import "prismjs/components/prism-markdown";

// import { getImage } from "../utils/imageStorage";

// const IndexedImage = (props) => {
//   const { src, alt, ...rest } = props;
//   const [resolvedSrc, setResolvedSrc] = useState(src);

//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       if (!src || !src.startsWith("indexeddb://")) {
//         setResolvedSrc(src);
//         return;
//       }

//       const imageId = src.replace("indexeddb://", "");
//       try {
//         const dataUrl = await getImage(imageId);

//         if (cancelled) return;

//         if (dataUrl) {
//           setResolvedSrc(dataUrl);
//         } else if (attempt < 5) {
//           setTimeout(() => {
//             load(attempt + 1);
//           }, 300);
//         } else {
//           console.warn("Image not found in IndexedDB after retries:", imageId);
//           setResolvedSrc(
//             'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
//           );
//         }
//       } catch (e) {
//         console.error("Failed to load image from IndexedDB:", imageId, e);
//         if (!cancelled) {
//           setResolvedSrc(src); 
//         }
//       }
//     };

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, [src]);

//   return <img src={resolvedSrc} alt={alt} {...rest} />;
// };

// const Preview = ({ content, columns, fontSize = 14 }) => {
//   const wrapperRef = useRef(null);


//   const processedContent = useMemo(() => {
//     let md = content || "";

//     md = md.replace(
//       /^([ \t]*)\[\s*\n([\s\S]*?)\n\1\]\s*$/gm,
//       (match, indent, inner) => {
//         return `${indent}$$\n${inner}\n${indent}$$`;
//       }
//     );

//     return md;
//   }, [content]);

//   useEffect(() => {
//     if (wrapperRef.current) {
//       Prism.highlightAllUnder(wrapperRef.current);
//     }
//   }, [processedContent, columns, fontSize]);

//   const columnStyle = {
//     fontSize: `${fontSize}px`,
//     columnCount: columns,
//     columnGap: "12px",
//   };

//   return (
//     <div className="preview-pane">
//       <div className="pane-header">
//         Preview ({columns} {columns === 1 ? "Column" : "Columns"})
//       </div>
//       <div className="preview-container">
//         <div className="preview-wrapper" style={columnStyle} ref={wrapperRef}>
//           <ReactMarkdown
//             remarkPlugins={[remarkGfm, remarkMath]}
//             rehypePlugins={[rehypeKatex]}
//             components={{
//               code({ inline, className, children, ...props }) {
//                 const match = /language-(\w+)/.exec(className || "");
//                 if (!inline && match) {
//                   return (
//                     <pre className={className}>
//                       <code className={className} {...props}>
//                         {children}
//                       </code>
//                     </pre>
//                   );
//                 }
//                 return (
//                   <code className={className} {...props}>
//                     {children}
//                   </code>
//                 );
//               },
//               img(props) {
//                 return <IndexedImage {...props} />;
//               },
//             }}
//           >
//             {processedContent}
//           </ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Preview;


import React, { useEffect, useRef, useState, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import { getImage } from "../utils/imageStorage";

import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";

import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * 在「markdown 字符串」阶段就把 $...$ / $$...$$ 渲染成 KaTeX HTML
 */
const renderMathInMarkdown = (md) => {
  let result = md || "";

  // 先保护掉真正想写 \$ 的地方
  result = result.replace(/\\\$/g, "@@ESCAPED_DOLLAR@@");

  // 处理块级 $$...$$（允许跨行）
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
    try {
      return katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      console.error("KaTeX block render error:", e, tex);
      return match; // 出错就保留原文
    }
  });

  // 处理行内 $...$（单个 $，避免 $$）
  // 为了避免一不小心吃到整段 HTML，保守一点，不跨越换行
  result = result.replace(/\$(?!\$)([^$\n]+?)\$(?!\$)/g, (match, tex) => {
    try {
      return katex.renderToString(tex, {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      console.error("KaTeX inline render error:", e, tex);
      return match;
    }
  });

  // 把 \$ 换回来
  result = result.replace(/@@ESCAPED_DOLLAR@@/g, "$");

  return result;
};

const Preview = ({ content, columns, fontSize = 14 }) => {
  const previewRef = useRef(null);
  const [processedHTML, setProcessedHTML] = useState("");

  // 1️⃣ 先做 [ ... ] → $$ ... $$ 的块公式转换
  const preprocessedMarkdown = useMemo(() => {
    let md = content || "";

    // 形如：
    // [
    //   foo
    //   bar
    // ]
    // → $$ foo \n bar $$
    md = md.replace(
      /^([ \t]*)\[\s*\n([\s\S]*?)\n\1\]\s*$/gm,
      (match, indent, inner) => {
        // 把 [ ... ] 内部的“物理换行”全部压成一个空格，
        // 这样 KaTeX 看到的是一条连续的 TeX 公式
        const collapsed = inner.replace(/\n[ \t]*/g, " ");
        return `${indent}$$${collapsed}$$`;
      }
    );
    
    md = md.replace(
      /(?<![A-Za-z0-9_\\])\((\\[a-zA-Z]+[^()]*)\)(?=[\s.,;:!?)]|$)/g,
      (match, tex) => `$${tex}$`
    );


    // 这里不再动 HTML，而是对 markdown 直接做 KaTeX 渲染
    md = renderMathInMarkdown(md);

    return md;
  }, [content]);

  // 2️⃣ marked 渲染 + IndexedDB 图片替换
  useEffect(() => {
    let cancelled = false;

    const processContent = async () => {
      // markdown（已经含 KaTeX HTML）→ 标准 HTML
      const rawHTML = marked(preprocessedMarkdown, {
        breaks: true,
        gfm: true,
      });

      // 替换 indexeddb:// 图片
      const indexedDBRegex =
        /(<img[^>]+src=["'])indexeddb:\/\/([^"']+)(["'][^>]*>)/gi;

      let html = rawHTML;
      const matches = [...rawHTML.matchAll(indexedDBRegex)];

      for (const match of matches) {
        const imageId = match[2]; // 例如 "img1765..."
        try {
          const dataUrl = await getImage(imageId);
          if (dataUrl) {
            html = html.replace(`indexeddb://${imageId}`, dataUrl);
          } else {
            console.warn("Image not found in IndexedDB:", imageId);
          }
        } catch (error) {
          console.error("Failed to load image:", error, imageId);
        }
      }

      // DOMPurify 清洗
      const sanitized = DOMPurify.sanitize(html, {
        ADD_ATTR: ["target"],
        ALLOW_DATA_ATTR: true,
        ADD_TAGS: ["img"],
      });

      if (!cancelled) {
        setProcessedHTML(sanitized);
      }
    };

    processContent();

    return () => {
      cancelled = true;
    };
  }, [preprocessedMarkdown]);

  // 3️⃣ 代码高亮
  useEffect(() => {
    if (!previewRef.current) return;
    Prism.highlightAllUnder(previewRef.current);
  }, [processedHTML, columns, fontSize]);

  const columnStyle = {
    fontSize: `${fontSize}px`,
    columnCount: columns,
    columnGap: "12px",
  };

  return (
    <div className="preview-pane">
      <div className="pane-header">
        Preview ({columns} {columns === 1 ? "Column" : "Columns"})
      </div>
      <div className="preview-container">
        <div
          ref={previewRef}
          className="preview-wrapper"
          style={columnStyle}
          dangerouslySetInnerHTML={{ __html: processedHTML }}
        />
      </div>
    </div>
  );
};

export default Preview;




