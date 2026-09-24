export type ACFPostType = {
  blog_right_side_foto_id: number;
  mobile_foto_id: number;
  blog_desktop_foto_id: number;
  category: string;
  post_content: string;
  post_description: string;
  slug: string;
  title: string;
  excerpt: string;
};
export type PostResponse = {
  data: {
    post: PostType;
    posts: {
      nodes: PostType[];
    };
    page: {
      featuredImage: {
        node: {
          altText: string;
          mediaItemUrl: string;
        };
      };
    };
  };
};

export type PostType = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  modified: string;
  blogPost: BlogPost;
  acf: ACFPostType;
  featuredImage: {
    node: {
      altText: string;
      mediaItemUrl: string;
    };
  };
  comments: {
    nodes: CommentType[];
  };
};

export type CommentType = {
  parentId: number;
  id: number;
  databaseId: number;
  content: string;
  author: {
    node: {
      name: string;
    };
  };
};
export type BlogPost = {
  blogDesktopFotoId: {
    node: {
      altText: string;
      mediaItemUrl: string;
      caption: string;
    };
  };
  blogRightSideFotoId: {
    node: {
      altText: string;
      mediaItemUrl: string;
      caption: string;
    };
  };
  blogSecondFotoId: {
    node: {
      mediaItemUrl: string;
      altText: string;
      caption: string;
    };
  };
  blogThirdFotoId: {
    node: {
      altText: string;
      mediaItemUrl: string;
      caption: string;
    };
  };
  mobileFotoId: {
    node: {
      altText: string;
      mediaItemUrl: string;
      caption: string;
    };
  };
  postContent: string;
  postContentSecond: string;
  postContentThird: string;
  postDescription: string;
  title: string;
  category: string;
  excerpt: string;
};

export type ImageType = {
  caption: {
    rendered: string;
  };
  alt_text: string;
  id: number;
  link: string;
  media_details: {
    file: string;
    height: number;
    width: number;
  };
  source_url: string;
};

export type LoadingType = 'lazy' | 'eager';

// export declare global {
//   interface Window {
//     handleCaptchaCallback: (token: string) => Promise<void>;
//     resetCaptcha: () => void;
//     handleCaptchaError: () => void;
//   }
// }
