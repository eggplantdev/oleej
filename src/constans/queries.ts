export const getPostDataQuery = (slug: string) => {
  return `
  {
    post(id: "${slug}", idType: SLUG) {
      id
      databaseId
      title
      slug
      date
      comments {
        nodes {
          parentId
          id
          databaseId
          content
          author{
            node{
              name
            }
          }
        }
      }
      blogPost {
        blogDesktopFotoId {
          node {
            altText
            mediaItemUrl
            caption
          }
        }
        blogRightSideFotoId {
          node {
            altText
            mediaItemUrl
            caption
          }
        }
        blogSecondFotoId {
          node {
            altText
            mediaItemUrl
            caption
          }
        }
        blogThirdFotoId {
          node {
            altText
            mediaItemUrl
            caption
          }
        }
        mobileFotoId {
          node {
            altText
            mediaItemUrl
            caption
          }
        }
        postContent
        postContentSecond
        postContentThird
        postDescription
        title
        category
      }
    }
    posts(where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        slug
        date
        id
          blogPost {
            category
            excerpt
            mobileFotoId {
                node {
                  altText
                  mediaItemUrl
              }
            }
          }
        }
      }
    page(id:"cG9zdDoxNjk=") {
      featuredImage{
        node{
          altText
          mediaItemUrl
        }
      }
    }
  }`;
};
export const allPostsQuery = `
  {
    posts(first: 100, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        title
        slug
        date
        id
          blogPost {
            category
            excerpt
            mobileFotoId {
                node {
                  altText
                  mediaItemUrl
              } 
            }
          }
        }
      }
  }`;
