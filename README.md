# Personal website

Welcome to my plain JS website!
This blog is built with plain JS using [Web Components API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), without any framworks

🌐 https://lylamin.com

Deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

## How Blog Posts Work

```mermaid
flowchart TB
    subgraph Write["1. Write"]
        md["pages/posts/my-post.md
        ―――――――――――――――
        ---
        title: My Post
        date: 2026-01-27
        tags: JS, Web
        ---
        # Content here..."]
    end

    subgraph Build["2. Build · git pre-commit hook"]
        scan[Scan pages/posts/*.md]
        parse[Parse frontmatter]
        slug[Generate slug from title]
        write["Write data/posts.js
        ―――――――――――――――
        { date, title, slug }"]
        stage[Stage data/posts.js]
        scan --> parse --> slug --> write --> stage
    end

    subgraph Render["3. Render"]
        direction TB
        list["Blog Listing
        components/blog-posts.js
        ―――――――――――――――
        imports data/posts.js
        renders &lt;ul&gt; of post links
        href='/posts/my-post'"]

        click_["User clicks a post
        /posts/my-post"]

        rewrite["Cloudflare Rewrite
        _redirects
        ―――――――――――――――
        /posts/* → /pages/post
        status 200 = rewrite
        URL stays unchanged"]

        loader["Post Loader
        utils/postLoader.js
        ―――――――――――――――
        extract slug from URL path
        fetch pages/posts/slug.md
        marked.js → HTML
        hljs → syntax highlighting"]

        page["Rendered Post Page"]

        list --> click_ --> rewrite --> loader --> page
    end

    md -->|commit| scan
    write -.-> list
    write -.-> loader
    md -.->|fetched at runtime| loader

    style Write fill:#2d333b,stroke:#768390,color:#adbac7
    style Build fill:#1c2128,stroke:#768390,color:#adbac7
    style Render fill:#1c2128,stroke:#768390,color:#adbac7
    style md fill:#2d333b,stroke:#539bf5,color:#adbac7
    style write fill:#2d333b,stroke:#57ab5a,color:#adbac7
    style page fill:#2d333b,stroke:#57ab5a,color:#adbac7
```

## Reference

- https://modernfontstacks.com/
- https://plainvanillaweb.com/blog/
