export type DepartmentType =
  | 'DEPT_2001'
  | 'DEPT_2002'
  | 'DEPT_2003'
  | 'DEPT_3001'
  | 'DEPT_3002'
  | 'DEPT_4001'
  | 'DEPT_4002'
  | 'DEPT_5001'
  | 'DEPT_5002'
  | 'DEPT_5003'
  | 'DEPT_5004'
  | 'DEPT_6001'
  | 'DEPT_6002'
  | 'DEPT_6003'
  | 'DEPT_6004'
  | 'DEPT_6005'
  | 'DEPT_6006'
  | 'DEPT_7001'
  | 'DEPT_7002'
  | 'DEPT_7003'
  | 'DEPT_7004'
  | 'DEPT_7005'
  | 'DEPT_7006'
  | 'DEPT_8001'
  | 'DEPT_9001'
  | 'UNKNOWN';

export interface DepartmentInfo {
  code: DepartmentType;
  displayName: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  { code: 'DEPT_2001', displayName: '컴퓨터소프트웨어공학과' },
  { code: 'DEPT_2002', displayName: '인공지능소프트웨어학과' },
  { code: 'DEPT_2003', displayName: '웹응용소프트웨어공학과' },
  { code: 'DEPT_3001', displayName: '기계공학과' },
  { code: 'DEPT_3002', displayName: '기계설계공학과' },
  { code: 'DEPT_4001', displayName: '자동화공학과' },
  { code: 'DEPT_4002', displayName: '로봇소프트웨어과' },
  { code: 'DEPT_5001', displayName: '전기공학과' },
  { code: 'DEPT_5002', displayName: '반도체전자공학과' },
  { code: 'DEPT_5003', displayName: '정보통신공학과' },
  { code: 'DEPT_5004', displayName: '소방안전관리과' },
  { code: 'DEPT_6001', displayName: '생명화학공학과' },
  { code: 'DEPT_6002', displayName: '바이오융합공학과' },
  { code: 'DEPT_6003', displayName: '건축과' },
  { code: 'DEPT_6004', displayName: '실내건축디자인과' },
  { code: 'DEPT_6005', displayName: '시각디자인과' },
  { code: 'DEPT_6006', displayName: 'AR·VR콘텐츠디자인과' },
  { code: 'DEPT_7001', displayName: '경영학과' },
  { code: 'DEPT_7002', displayName: '세무회계학과' },
  { code: 'DEPT_7003', displayName: '유통마케팅학과' },
  { code: 'DEPT_7004', displayName: '호텔관광학과' },
  { code: 'DEPT_7005', displayName: '경영정보학과' },
  { code: 'DEPT_7006', displayName: '빅데이터경영과' },
  { code: 'DEPT_8001', displayName: '자유전공학과' },
  { code: 'DEPT_9001', displayName: '교양과' },
  { code: 'UNKNOWN', displayName: '알 수 없음' },
];

export const UNKNOWN_DEPARTMENT: DepartmentInfo = {
  code: 'UNKNOWN',
  displayName: '알 수 없음',
};

export function getDepartmentByCode(code: string): DepartmentInfo {
  return DEPARTMENTS.find((department) => department.code === code) ?? UNKNOWN_DEPARTMENT;
}

export function getDepartmentByDisplayName(displayName: string): DepartmentInfo {
  return (
    DEPARTMENTS.find((department) => department.displayName === displayName) ??
    UNKNOWN_DEPARTMENT
  );
}

export function getDepartmentDisplayName(code: string): string {
  return getDepartmentByCode(code).displayName;
}

export function getDepartmentCode(displayName: string): DepartmentType {
  return getDepartmentByDisplayName(displayName).code;
}