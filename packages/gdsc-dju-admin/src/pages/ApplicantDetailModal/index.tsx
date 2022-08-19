import React, { memo, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClearButton } from '@common/ModalButton';
import { modalVariants } from '@src/components/animations/modalVariants';
import { getApplicant } from '@utils/applicantsHandler';
import ApplicantChatContainer from './ApplicantChat';
import ApplicantInfoCard from './ApplicantInformation';
import ApplicantInfoState from './ApplicantState';

import {
  ApplicantDataWrapper,
  ApplicantInfoHeader,
  ApplicantInfoSection,
  ApplicantInfoWrapper,
  ApplicantModalInner,
} from './styled';
import ApplicationContent from './ApplicationContent';
import { Application } from '@gdsc-dju/shared/types';

interface Props {
  userid: string;
}

const ApplicantDetailModal = ({ userid }: Props) => {
  const [applicantData, setApplicantData] = useState<Application>();

  const navigate = useNavigate();

  const applicantHandler = async () => {
    if (userid) {
      const applicant = await getApplicant(userid);
      setApplicantData(applicant);
    }
  };

  useEffect(() => {
    applicantHandler();
  }, [userid]);

  return (
    <AnimatePresence>
      <ApplicantModalInner variants={modalVariants} layoutId={`card-${userid}`}>
        {applicantData && (
          <ApplicantInfoWrapper>
            <ApplicantInfoCard applicantData={applicantData} />
            <ApplicantInfoState
              applicantData={applicantData}
              setApplicantData={setApplicantData}
            />
          </ApplicantInfoWrapper>
        )}
        <ApplicantInfoSection>
          <ApplicantInfoHeader>
            <ClearButton onClick={() => navigate(-1)} />
          </ApplicantInfoHeader>
          {applicantData && (
            <ApplicantDataWrapper>
              <ApplicationContent applicantData={applicantData} />
              <ApplicantChatContainer applicantId={applicantData.id} />
            </ApplicantDataWrapper>
          )}
        </ApplicantInfoSection>
      </ApplicantModalInner>
    </AnimatePresence>
  );
};

export default memo(ApplicantDetailModal);
