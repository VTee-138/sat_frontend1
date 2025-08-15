import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { v4 as uuidv4 } from "uuid";
import parse from "html-react-parser";

const MathRenderer = ({ content }) => {
  const parseContent = (text) => {
    if (!text) return [];

    // Kiểm tra nếu content chứa HTML tags
    const hasHtmlTags = /<[^>]*>/g.test(text);

    if (hasHtmlTags) {
      // Xử lý content có HTML formatting
      return parseHtmlContent(text);
    } else {
      // Xử lý content thông thường (chỉ có text và LaTeX)
      return parseTextContent(text);
    }
  };

  const parseHtmlContent = (htmlText) => {
    // Thay thế các ký hiệu latex block như \[...\] bằng $...$
    htmlText = htmlText.replaceAll("\\[", "$");
    htmlText = htmlText.replaceAll("\\]", "$");

    // Clean up br tags ở đầu và cuối
    htmlText = htmlText.replace(/^(\s*<br\s*\/?>)+/gi, "");
    htmlText = htmlText.replace(/(\s*<br\s*\/?>)+$/gi, "");

    // Remove multiple consecutive br tags
    htmlText = htmlText.replace(/(<br\s*\/?>){3,}/gi, "<br/><br/>");

    // Xử lý bullet points và list items đặc biệt
    htmlText = htmlText.replaceAll(/•/g, "•"); // Preserve bullet points
    htmlText = htmlText.replaceAll(/◦/g, "◦"); // White bullet
    htmlText = htmlText.replaceAll(/▪/g, "▪"); // Black small square
    htmlText = htmlText.replaceAll(/▫/g, "▫"); // White small square

    // Regex để tìm tất cả các công thức toán học $...$
    const regex = /\$(.*?)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(htmlText)) !== null) {
      // Đẩy phần HTML trước công thức vào mảng parts
      if (match.index > lastIndex) {
        const htmlPart = htmlText.substring(lastIndex, match.index);
        // Thêm vào nội dung đáp án nếu không phải dòng trống
        if (htmlPart.trim()) {
          try {
            // Sử dụng dangerouslySetInnerHTML cho các HTML content phức tạp
            // để tránh DOM node parsing issues
            if (htmlPart.includes("<") && htmlPart.includes(">")) {
              parts.push(
                <span
                  key={uuidv4()}
                  dangerouslySetInnerHTML={{ __html: htmlPart }}
                />
              );
            } else {
              // Plain text, add directly
              parts.push(htmlPart);
            }
          } catch (error) {
            console.error("Error parsing HTML:", error);
            // Fallback: thêm text thuần
            parts.push(htmlPart);
          }
        }
      }

      // Xử lý công thức toán học
      let formula = match[1];
      formula = processLatexFormula(formula);

      if (/[à-ỹ]/i.test(formula)) {
        parts.push(formula);
      } else {
        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
          });
          parts.push(
            <span key={uuidv4()} dangerouslySetInnerHTML={{ __html: html }} />
          );
        } catch (error) {
          console.error("Error rendering LaTeX:", error);
          parts.push(formula); // Fallback to plain text
        }
      }
      lastIndex = regex.lastIndex;
    }

    // Đẩy phần HTML cuối cùng vào mảng parts
    if (lastIndex < htmlText?.length) {
      const remainingHtml = htmlText.substring(lastIndex);
      if (remainingHtml.trim()) {
        try {
          // Sử dụng dangerouslySetInnerHTML cho remaining HTML
          if (remainingHtml.includes("<") && remainingHtml.includes(">")) {
            parts.push(
              <span
                key={uuidv4()}
                dangerouslySetInnerHTML={{ __html: remainingHtml }}
              />
            );
          } else {
            parts.push(remainingHtml);
          }
        } catch (error) {
          console.error("Error parsing remaining HTML:", error);
          parts.push(remainingHtml);
        }
      }
    }

    return parts;
  };

  const parseTextContent = (text) => {
    // Thay thế các ký hiệu latex block như \[...\] bằng $...$
    text = text.replaceAll("\\[", "$");
    text = text.replaceAll("\\]", "$");

    // Đảm bảo xuống dòng bằng cách thay các ký hiệu xuống dòng (\n) bằng <br />
    text = text.replaceAll(/\n/g, "<br/>");
    // Regex để tìm tất cả các công thức toán học $...$
    const regex = /\$(.*?)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Đẩy phần text trước công thức vào mảng parts
      if (match.index > lastIndex) {
        const plainText = text.substring(lastIndex, match.index);
        if (plainText === "<br/>") {
          parts.push(<br key={`line-${uuidv4()}`} />);
        } else if (plainText?.includes("<br/>")) {
          const plainTextArray = plainText?.split("<br/>");
          plainTextArray.forEach((line, index) => {
            if (plainTextArray.length === 1) {
              if (plainText.startsWith("<br/>")) {
                parts.push(<br key={`line-${uuidv4()}`} />);
                parts.push(line); // Đẩy nội dung vào parts
              } else if (plainText.endsWith("<br/>")) {
                parts.push(line); // Đẩy nội dung vào parts
                parts.push(<br key={`line-${uuidv4()}`} />);
              }
            } else {
              parts.push(line); // Đẩy nội dung vào parts
              if (index !== plainTextArray.length - 1) {
                parts.push(<br key={`line-${uuidv4()}`} />);
              }
            }
          });
        } else {
          parts.push(plainText);
        }
      }

      // Lấy công thức toán học từ match và loại bỏ dấu $
      let formula = match[1];
      formula = processLatexFormula(formula);

      // Render công thức bằng KaTeX và đẩy vào mảng parts
      if (/[à-ỹ]/i.test(formula)) {
        parts.push(formula);
      } else {
        const html = katex.renderToString(formula, {
          throwOnError: false,
        });
        parts.push(
          <span key={uuidv4()} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }
      lastIndex = regex.lastIndex;
    }

    // Đẩy phần text cuối cùng (sau công thức cuối cùng) vào mảng parts
    if (lastIndex < text?.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText === "<br/>") {
        parts.push(<br key={`line-${uuidv4()}`} />);
      } else if (remainingText?.includes("<br/>")) {
        const remainingTextArray = remainingText?.split("<br/>");
        remainingTextArray.forEach((line, index) => {
          if (remainingTextArray.length === 1) {
            if (remainingText.startsWith("<br/>")) {
              parts.push(<br key={`line-${uuidv4()}`} />);
              parts.push(line); // Đẩy nội dung vào parts
            } else if (remainingText.endsWith("<br/>")) {
              parts.push(line); // Đẩy nội dung vào parts
              parts.push(<br key={`line-${uuidv4()}`} />);
            }
          } else {
            if (line.trim() !== "") {
              parts.push(line); // Đẩy nội dung vào parts
            }
            if (index !== remainingTextArray.length - 1) {
              parts.push(<br key={`line-${uuidv4()}`} />); // Thêm <br /> sau mỗi dòng
            }
          }
        });
      } else {
        parts.push(remainingText);
      }
    }

    return parts;
  };

  const processLatexFormula = (formula) => {
    if (
      formula.includes("{\\begin{array}{*{20}{l}}") ||
      formula.includes("{\\begin{array}{*{20}{r}}") ||
      formula.includes("{\\begin{array}{*{20}{c}}")
    ) {
      // Sửa lỗi hệ phương trình
      formula = formula.replaceAll("\\left\\{", "");
      formula = formula.replaceAll(/\\left\[/g, "");
      formula = formula.replaceAll("} \\right.}", "");
      formula = formula.replaceAll("\\right.}", "");
      formula = formula.replaceAll(/\\right\./g, "");

      // 🔹 Xóa `\begin{array}{l}` và `\end{array}` nếu có
      formula = formula.replaceAll(
        "{\\begin{array}{*{20}{l}}",
        "\\begin{cases}"
      );
      formula = formula.replaceAll(
        "{\\begin{array}{*{20}{r}}",
        "\\begin{cases}"
      );

      formula = formula.replaceAll(
        "{\\begin{array}{*{20}{c}}",
        "\\begin{cases}"
      );
      formula = formula.replaceAll("\\begin{array}{l}", "\\begin{cases}");

      formula = formula.replaceAll("end{array}}", "end{cases}");
      formula = formula.replaceAll("\\end{array}", "\\end{cases}");
      formula = formula.replaceAll(
        "{\\rm{ suy ra }}",
        "\\quad \\Rightarrow \\quad"
      );
    } else if (formula.includes("\\begin{array}{*{20}{l}}")) {
      formula = formula.replaceAll(
        "\\begin{array}{*{20}{l}}",
        "\\begin{aligned}"
      );
      formula = formula.replaceAll("\\end{array}", "\\end{aligned}");
    }

    // Render công thức bằng KaTeX và đẩy vào mảng parts
    formula = formula.replaceAll("<br/>", "").replaceAll("^^\\circ", "^\\circ");

    return formula;
  };

  const parsedContent = useMemo(() => {
    return parseContent(content);
  }, [content]);

  return (
    <div
      style={{
        // Base styles để đảm bảo formatting hoạt động
        lineHeight: "1.6",
      }}
    >
      <style>
        {`
         /* Reset để tránh conflicts */
         .math-renderer * {
           list-style: none;
         }
         
         /* CSS cho các elements được render bằng dangerouslySetInnerHTML */
         .math-renderer strong, .math-renderer b { font-weight: bold; }
         .math-renderer em, .math-renderer i { font-style: italic; }
         .math-renderer u { text-decoration: underline; }
         .math-renderer del { text-decoration: line-through; }
         .math-renderer sub { vertical-align: sub; font-size: smaller; }
         .math-renderer sup { vertical-align: super; font-size: smaller; }
         .math-renderer mark { background-color: #fef08a; padding: 1px 3px; }
         
         /* CSS cho lists với bullet points - Override reset */
         .math-renderer ul { 
           margin-left: 20px; 
           padding-left: 0;
           list-style-type: disc !important;
           list-style-position: outside !important;
         }
         .math-renderer ol { 
           margin-left: 20px; 
           padding-left: 0;
           list-style-type: decimal !important;
           list-style-position: outside !important;
         }
         .math-renderer li { 
           margin: 4px 0; 
           display: list-item !important;
           list-style-type: inherit !important;
           list-style-position: inherit !important;
           padding-left: 4px;
         }
                   /* CSS cho tables từ Word */
          .math-renderer .word-table {
            border-collapse: collapse !important;
            margin: 10px auto !important;
            border: 2px solid #333 !important;
            width: auto !important;
            min-width: 200px !important;
            max-width: 100% !important;
            font-family: inherit !important;
          }
          
          .math-renderer .word-table-cell {
            border: 1px solid #333 !important;
            padding: 8px 12px !important;
            text-align: center !important;
            background-color: #f9f9f9 !important;
            vertical-align: middle !important;
          }
          
          .math-renderer .word-table-header {
            border: 2px solid #333 !important;
            padding: 8px 12px !important;
            text-align: center !important;
            background-color: #d0d0d0 !important;
            font-weight: bold !important;
            vertical-align: middle !important;
          }
          
          .math-renderer .word-table-row {
            border: 1px solid #333 !important;
          }

          .math-renderer .word-table-body {
            border: inherit !important;
          }

          .math-renderer .word-table-head {
            border: inherit !important;
            background-color: #d0d0d0 !important;
          }

          /* Fallback cho table chung */
          table, th, td {
           border: 1px solid;
           padding: 5px;
          }

          /* Responsive table */
          @media (max-width: 768px) {
            .math-renderer .word-table {
              font-size: 12px !important;
              min-width: 150px !important;
            }
            
            .math-renderer .word-table-cell,
            .math-renderer .word-table-header {
              padding: 4px 6px !important;
            }
          }`}
      </style>
      <div className="math-renderer">
        {parsedContent
          ?.map((part, index) => {
            // Safety check để đảm bảo part là valid React child
            if (part === null || part === undefined) {
              return null;
            }

            // Nếu part là object có properties DOM node, skip nó
            if (typeof part === "object" && part.type && part.parent) {
              console.warn("Skipping invalid DOM node:", part);
              return null;
            }

            // Nếu part là string hoặc number, render trực tiếp
            if (typeof part === "string" || typeof part === "number") {
              return <span key={index}>{part}</span>;
            }

            // Nếu part là React element, render normal
            return <React.Fragment key={index}>{part}</React.Fragment>;
          })
          .filter(Boolean)}
      </div>
    </div>
  );
};

export default MathRenderer;
