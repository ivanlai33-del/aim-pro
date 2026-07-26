'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProtectedProposalPortal from '@/components/proposal-portal/ProtectedProposalPortal';
import { ProjectData } from '@/types/project';

export default function PublicProposalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = (params?.id as string) || 'demo';
  const isAdminBypass = searchParams?.get('admin') === '87257257';

  // Demo Project Data fallback
  const demoProjectData: ProjectData = {
    projectName: '專案估價與合約服務計畫',
    clientName: '委託客戶公司',
    industry: 'web',
    budget: 150000,
    deadline: '2026-12-31',
    description: '為客戶打造高效能、高安全、兼具防偽與隱私對帳機制的專業系統。',
    features: ['線上保密網址存取', '5重防拷保護', '預約對帳戶名綁定', '白紙黑字簽核列印'],
  };

  const demoQuotationItems = [
    { id: '1', description: '需求分析與系統架構規劃', quantity: 1, unitPrice: 35000 },
    { id: '2', description: 'RWD 響應式介面設計與重構', quantity: 1, unitPrice: 45000 },
    { id: '3', description: '雲端 API 與資料庫防護整合', quantity: 1, unitPrice: 50000 },
    { id: '4', description: '線上發票與預約對帳綁定系統', quantity: 1, unitPrice: 20000 },
  ];

  const demoProviderInfo = {
    name: '職人專業顧問工作室',
    taxId: '41370842',
    phone: '0987528785',
    address: '台灣桃園市內壢區',
    contact: 'ivanlai33',
    primaryBank: {
      bankName: '中國信託銀行 (822) 內壢簡易型分行',
      branch: '內壢分行',
      accountName: '賴奕暢',
      accountNumber: '131540035543',
    },
  };

  return (
    <ProtectedProposalPortal
      projectId={projectId}
      title="網站全站重置與工程重構專案報價計畫書"
      projectData={demoProjectData}
      quotationItems={demoQuotationItems}
      providerInfo={demoProviderInfo}
      isAdminBypass={isAdminBypass}
    />
  );
}
