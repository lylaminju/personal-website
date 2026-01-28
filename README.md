# Personal website

Welcome to my plain JS website!
This blog is built with plain JS using [Web Components API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), without any framworks

🌐 https://lylamin.com

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
        check{"Staged files include
        pages/posts/*.md?"}
        scan[Scan pages/posts/*.md]
        parse[Parse frontmatter]
        slug[Generate slug from title]
        write["Write data/posts.js
        ―――――――――――――――
        { date, title, slug, file }"]
        stage[Stage data/posts.js]
        check -->|Yes| scan --> parse --> slug --> write --> stage
        check -->|No| skip[Skip build]
    end

    subgraph Render["3. Render"]
        direction TB
        list["Blog Listing
        components/blog-posts.js
        ―――――――――――――――
        imports data/posts.js
        renders &lt;ul&gt; of post links"]

        click_["User clicks a post
        /pages/post.html?slug=my-post"]

        loader["Post Loader
        utils/postLoader.js
        ―――――――――――――――
        slug → posts.find() → file
        fetch .md → parse frontmatter
        marked.js → HTML
        hljs → syntax highlighting"]

        page["Rendered Post Page"]

        list --> click_ --> loader --> page
    end

    md --> scan
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
