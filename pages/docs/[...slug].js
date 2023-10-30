import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

// mdx
import fs from "fs";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import { MDXRemote } from "next-mdx-remote";
import rehypePrettyCode from "rehype-pretty-code";
import { serialize } from "next-mdx-remote/serialize";

// routes
import { routes as htmlRoutes } from "routes/html.routes";
import { routes as reactRoutes } from "routes/react.routes";

// utils
import filterArray from "utils/filter-array";
import { rehypePrettyCodeConfig } from "utils";
import getDirectoriesAndFile from "utils/get-directories-and-files";

export default function Page({ frontMatter, mdxSource, slug }) {

    const { asPath } = useRouter();
    const {mobileNav, setMobileNav} = React.useState(false);

    const routes = {
        html: htmlRoutes,
        react: reactRoutes,
    };

    const validFrameworks = ["html", "react", "vue", "angular", "svelte"];
    const frameworkType = asPath.split("/")
    .filter((el) => validFrameworks.includes(el))
    .join("")

    const replaceMatch = [
        "html/what-is-tailwind-css",
        "html/license",
        "html/colors",
        "html/fonts",
        "html/shadows",
        "html/screens",
      ];
      const headLink = slug.join("/");
      console.log(headLink)
      const matchTheSlug = replaceMatch.includes(headLink);
      const canonical = matchTheSlug
        ? headLink.replace("html/", "react/")
        : headLink;

    return (
        <>
            <Head>
                <title>{frontMatter.title}</title>
                <meta name="description" content={frontMatter.description} />
                <link
                rel="canonical"
                href={`https://www.material-tailwind.com/docs/${canonical}`}
                />
            </Head>
            <Alert className="w-full justify-center rounded-none">
                <div className="flex  items-center justify-center gap-4">
                NEW | Material Tailwind PRO, a comprehensive compilation of 170+
                blocks, now available for your use.
                <Link href="/blocks">
                    <Button size="sm" color="white">
                    check out
                    </Button>
                </Link>
                </div>
            </Alert>
            <div className="relative mb-8 h-full w-full bg-white">
                <DocsNavbar slug={slug} setMobileNav={setMobileNav} />
                <div className="px-6">
                <div className="container mx-auto flex">
                    <Sidenav
                    routes={routes[frameworkType]}
                    type={frameworkType}
                    slug={slug[slug.length - 1]}
                    mobileNav={mobileNav}
                    setMobileNav={setMobileNav}
                    />
                    <div className="mt-6 w-full lg:w-[60%] lg:px-6">
                    <MDXRemote {...mdxSource} components={components} />
                    </div>
                    <PageMap type={frameworkType} frontMatter={frontMatter} />
                </div>
                </div>
            </div>
            <Footer />
        </>
    )

}


export const getStaticPaths = async () => {
    const baseDirectory = "documentation";
    const paths = [];
    const allDir = getDirectoriesAndFile(baseDirectory);
    
    const filteredArray = filterArray(allDir);
  
    for (let i = 0; i < filteredArray.length - 1; i++) {
      const directories =
        filteredArray[i] !== null &&
        filteredArray[i].split("/").filter((dir) => dir !== baseDirectory);
      const files = filteredArray[i + 1].includes("/")
        ? filteredArray[i + 1].split("/").filter((dir) => dir !== baseDirectory)
        : filteredArray[i + 1];
  
      const filename = Array.isArray(files) ? null : files;
  
      filename &&
        paths.push({
          params: {
            slug: [...directories, filename],
          },
        });
    }
  
    return {
      paths: paths,
      fallback: false,
    };
  };
  
  export const getStaticProps = async ({ params: { slug } }) => {
    const markdownWithMeta = fs.readFileSync(
      `documentation/${slug.join("/")}.mdx`,
    );
  
    const { data: frontMatter, content } = matter(markdownWithMeta);
  
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeConfig]],
        remarkPlugins: [remarkGfm],
        development: false,
      },
    });
  
    return {
      props: {
        frontMatter,
        mdxSource,
        slug,
      },
    };
  };