import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { MarkdownImage } from "@/components/MarkdownImage";
import "highlight.js/styles/github-dark.css";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingText(
      (children as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

function Heading({
  as: Tag,
  children,
}: {
  as: "h2" | "h3" | "h4";
  children?: ReactNode;
}) {
  const id = slugify(headingText(children));
  return (
    <Tag id={id}>
      <a href={`#${id}`} className="heading-anchor">
        {children}
      </a>
    </Tag>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children }) => <Heading as="h2">{children}</Heading>,
          h3: ({ children }) => <Heading as="h3">{children}</Heading>,
          h4: ({ children }) => <Heading as="h4">{children}</Heading>,
          a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;
            const external = /^https?:\/\//i.test(href);
            if (external) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <Link href={href}>{children}</Link>;
          },
          img: ({ src, alt }) => (
            <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
