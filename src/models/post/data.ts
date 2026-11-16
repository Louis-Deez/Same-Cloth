export interface PostData {
  postImage: File | null,
  postCaption: string,
}

export const emptyPostData: PostData = {
  postImage: null,
  postCaption: ""
};