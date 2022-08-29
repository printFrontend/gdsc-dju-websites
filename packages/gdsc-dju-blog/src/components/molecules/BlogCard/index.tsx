import React, { memo, useCallback, useState } from 'react';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

import {
  BlogCardAuthorImage,
  BlogCardAuthorWrapper,
  BlogCardBottomBox,
  BlogCardInner,
  BlogCardPostText,
  BlogCardSubText,
  BlogCardSubTextWrapper,
  BlogCardTagWrapper,
  BlogCardThumbnail,
  BlogCardThumbnailWrapper,
  BlogCardTitle,
  BookMarkWrapper,
  PostText,
} from './styled';
import { HashTageLight } from '@src/components/atoms/HashTage';
import { useSetBookMark } from '@src/hooks/useSetBookMark';
import { DetailPostDataType } from '@type/postData';
<<<<<<< HEAD:packages/gdsc-dju-blog/src/components/molecules/BlogCard/index.tsx
import { dateFilter } from '@utils/dateFilter';
import { hashTageSpreader } from '@utils/hashTageSpreader';
import BookmarkIcon from '@assets/icons/BookmarkIcon';
=======

import BookmarkIcon from '@assets/icons/BookmarkIcon';
import { dateFilter } from '@utils/dateFilter';
import { hashTageSpreader } from '@utils/hashTageSpreader';
>>>>>>> 5ec2cca35b4258a663fac6f7f27690ad215f7067:packages/gdsc-dju-blog/src/components/common/BlogCard/index.tsx

const PostTextVariants = {
  initial: {
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

interface BlogCardProps {
  postData: DetailPostDataType;
  isScrap: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ postData, isScrap }) => {
  const [IsHovered, setIsHovered] = useState(false);
  const [isMarked, setIsMarked] = useState(isScrap);
  const [cookie] = useCookies(['token']);
  const { bookMarkHandler } = useSetBookMark(
    postData.postId,
    cookie.token,
    () => setIsMarked(!isMarked),
  );

  const navigate = useNavigate();

  const linkToPost = useCallback(() => {
    navigate(`/${postData.memberInfo.nickname}/${postData.postId}`);
  }, [postData]);

  const removeMarkdownInContent = postData.content
    .replace(/!\[.*\]/gi, '') // ![] 제거
    .replace(/\(.*\)/gi, '') // ( ) 제거
    .replace(/\|/gi, '') // | 제거
    .replace(/#/gi, '') // # 제거
    .replace(/-/gi, ''); // @ 제거

  return (
    <AnimateSharedLayout>
      <BlogCardInner onClick={linkToPost}>
        {/* 북마크 */}
        <BookMarkWrapper onClick={(e) => bookMarkHandler(e)}>
          <BookmarkIcon marked={isMarked} />
        </BookMarkWrapper>
        {/* 이미지 */}
        <BlogCardThumbnailWrapper>
          <BlogCardThumbnail
            src={postData.imagePath ?? '../../../assets/mocks/unknown.png'}
            alt="BlogCardThumbnail"
          />
        </BlogCardThumbnailWrapper>
        {/* 태그 */}
        {postData.postHashTags && (
          <BlogCardTagWrapper IsHovered={IsHovered}>
            {hashTageSpreader(postData.postHashTags)
              .filter((data, index) => index < 2)
              .map((data: string, index: number) => (
                <HashTageLight key={index} text={data} />
              ))}
          </BlogCardTagWrapper>
        )}
        {/* 하단 PostHeader */}
        <BlogCardBottomBox
          isHovered={IsHovered}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          <BlogCardTitle>{postData.title}</BlogCardTitle>
          <AnimatePresence>
            {IsHovered && (
              <BlogCardPostText
                key="BlogCardPostText"
                variants={PostTextVariants}
                initial={'initial'}
                animate={'visible'}
                exit={'exit'}
              >
                <PostText>{removeMarkdownInContent}</PostText>
              </BlogCardPostText>
            )}
          </AnimatePresence>
          <BlogCardSubTextWrapper>
            {postData.memberInfo &&
              postData.memberInfo.nickname &&
              postData.memberInfo.profileImageUrl && (
                <BlogCardAuthorWrapper>
                  <BlogCardAuthorImage
                    alt="AuthorImage"
                    src={postData.memberInfo.profileImageUrl}
                  />

                  <BlogCardSubText subText={true}>by</BlogCardSubText>
                  <BlogCardSubText bold={true}>
                    {postData.memberInfo.nickname}
                  </BlogCardSubText>
                </BlogCardAuthorWrapper>
              )}
            <BlogCardSubText subText={true}>
              {dateFilter(postData.category.uploadDate)}
            </BlogCardSubText>
          </BlogCardSubTextWrapper>
        </BlogCardBottomBox>
      </BlogCardInner>
    </AnimateSharedLayout>
  );
};

export default memo(BlogCard);
