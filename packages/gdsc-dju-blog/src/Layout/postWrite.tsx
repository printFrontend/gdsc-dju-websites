import React, {
  ChangeEvent,
  Dispatch,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '../hooks/ThemeHandler';

import {
  PostBottomButtonBox,
  PostBottomButtonWrapper,
  PostContentWrapper,
  PostFileImage,
  PostGDSCButtonWrapper,
  PostHashtag,
  PostInformation,
  PostLayoutWrapper,
  PostThumbnailInner,
  PostThumbnailWrapper,
  PostTitle,
  ThumbnailText,
} from './postWrite.styled';
import PostThumbnail from '@assets/mocks/PostThumbnail';
import PostCategoryMenu from '@src/components/layouts/PostCategoryMenu';
import { DetailPostDataType, PostPostDataType } from '@type/postData';
import { GDSCButton } from '@src/components/atoms/Button';

import { ContentEditor } from '@src/components/atoms/toastUi';

interface PostWriteProps {
  postData: DetailPostDataType | undefined;
  submitHandler: (postData: PostPostDataType, type: string) => void;
  fileHandler: (
    e: ChangeEvent<HTMLInputElement>,
    setDetailPostData: Dispatch<React.SetStateAction<PostPostDataType>>,
    files: FileList | undefined | null,
  ) => void;
  setFileImage: Dispatch<React.SetStateAction<string | null>>;
  fileImage: string | null;
  id: string | undefined;
}

const PostWriteLayout: React.FC<PostWriteProps> = ({
  postData,
  submitHandler,
  fileHandler,
  fileImage,
  setFileImage,
  id,
}) => {
  const [detailPostData, setDetailPostData] = useState<PostPostDataType>({
    base64Thumbnail: '',
    fileName: '',
    title: '',
    category: {
      categoryName: '',
    },
    content: '',
    postHashTags: '',
    tmpStore: undefined,
  });
  const editorRef: any = useRef();
  const input = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { theme } = useTheme();
  const isUpdate = id !== undefined;
  const isButtonBlock =
    !detailPostData.category.categoryName ||
    !detailPostData.title ||
    detailPostData.content.length < 10;
  const setEditorValue = () => {
    const editorContent = editorRef.current.getInstance().getMarkdown();
    setDetailPostData(() => {
      return { ...detailPostData, content: editorContent };
    });
  };
  const setCategory = (category: string) => {
    setDetailPostData(() => {
      return { ...detailPostData, category: { categoryName: category } };
    });
  };
  useLayoutEffect(() => {
    postData &&
      setDetailPostData({
        ...detailPostData,
        title: postData.title,
        category: {
          categoryName: postData.category.categoryName.toLowerCase(),
        },
        content: postData.content,
        postHashTags: postData.postHashTags,
      });
    postData && setFileImage(postData.imagePath);
  }, [postData, id]);
  return (
    <PostLayoutWrapper>
      <PostCategoryMenu
        onClick={setCategory}
        category={detailPostData.category.categoryName}
      />
      <PostInformation>
        <PostThumbnailWrapper>
          <PostThumbnailInner onClick={() => input.current?.click()}>
            <ThumbnailText>
              {fileImage
                ? '썸네일을 수정하려면 다시 눌러주세요!'
                : '썸네일을 선택해주세요!'}
            </ThumbnailText>
            {fileImage ? (
              <>
                <PostThumbnail />
                <PostFileImage src={fileImage} />
              </>
            ) : (
              <PostThumbnail />
            )}
          </PostThumbnailInner>
          <input
            ref={input}
            style={{ display: 'none' }}
            type="file"
            name="imgFile"
            id="imgFile"
            onChange={(e) =>
              fileHandler(e, setDetailPostData, input.current?.files)
            }
          />
        </PostThumbnailWrapper>

        <PostContentWrapper>
          <PostTitle
            placeholder="제목을 입력하세요."
            value={detailPostData.title}
            onChange={(e) => {
              setDetailPostData(() => {
                return { ...detailPostData, title: e.target.value };
              });
            }}
          />
          <PostHashtag
            placeholder={'#해시태그 ,로 구분하세요'}
            value={detailPostData.postHashTags}
            onChange={(e) => {
              setDetailPostData(() => {
                return { ...detailPostData, postHashTags: e.target.value };
              });
            }}
          />
        </PostContentWrapper>
      </PostInformation>
      <PostGDSCButtonWrapper>
        <GDSCButton
          text="임시글"
          onClick={() => {
            navigate(`/post/saves`);
          }}
        />
      </PostGDSCButtonWrapper>

      {id ? (
        detailPostData.content !== '' && (
          <ContentEditor content={detailPostData.content} ref={editorRef} />
        )
      ) : (
        <ContentEditor content={detailPostData.content} ref={editorRef} />
      )}

      <BottomPostButtonBox
        isUpdate={isUpdate}
        postCancel={() => submitHandler(detailPostData, 'backBlock')}
        postSubmit={() => {
          submitHandler(detailPostData, isUpdate ? 'update' : 'uploadPost');
        }}
        disable={isButtonBlock}
        draft={() => {
          submitHandler(detailPostData, 'draft');
        }}
      />
    </PostLayoutWrapper>
  );
};
const BottomPostButtonBox: React.FC<{
  postCancel: () => void;
  postSubmit: () => void;
  draft: () => void;
  disable: boolean;
  isUpdate: boolean;
}> = ({ postCancel, postSubmit, draft, disable, isUpdate }) => {
  return (
    <PostBottomButtonBox>
      <PostBottomButtonWrapper className={'cancel-button'}>
        <GDSCButton text="작성취소" onClick={postCancel} />
      </PostBottomButtonWrapper>
      <PostBottomButtonWrapper>
        <GDSCButton text="임시저장" onClick={draft} disable={disable} />
      </PostBottomButtonWrapper>
      <PostBottomButtonWrapper>
        <GDSCButton
          text={isUpdate ? '수정하기' : '업로드'}
          onClick={() => {
            !disable && (isUpdate ? postSubmit() : postSubmit());
          }}
          color={'googleBlue'}
          disable={disable}
        />
      </PostBottomButtonWrapper>
    </PostBottomButtonBox>
  );
};

export default PostWriteLayout;
