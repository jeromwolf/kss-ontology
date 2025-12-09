'use client';

import React from 'react';
import { HelpModal, HelpSection, TipBox } from '@/components/common/HelpModal';
import { 
  MousePointer, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Zap,
  Network,
  FileCode2
} from 'lucide-react';

interface RDFEditorHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RDFEditorHelp: React.FC<RDFEditorHelpProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <HelpModal
      isOpen={isOpen}
      onClose={onClose}
      title="RDF Triple 에디터 사용 가이드"
    >
      <HelpSection icon={<Plus className="w-5 h-5 text-green-500" />} title="1. 트리플 추가하기">
        <p>RDF는 <strong>주어-서술어-목적어</strong>의 트리플 구조로 지식을 표현합니다.</p>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <p>예시 1: :홍길동 :직업 :개발자</p>
          <p>예시 2: :서울 :수도이다 :대한민국</p>
          <p>예시 3: :김철수 :나이 "30" (리터럴)</p>
        </div>
        
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>주어(Subject)</strong>: 설명하려는 대상 (예: :홍길동, :서울)</li>
          <li><strong>서술어(Predicate)</strong>: 속성이나 관계 (예: :직업, :나이)</li>
          <li><strong>목적어(Object)</strong>: 값이나 다른 자원
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>리소스: 다른 개체를 참조 (예: :개발자)</li>
              <li>리터럴: 실제 값 (예: "30", "홍길동")</li>
            </ul>
          </li>
        </ol>
        
        <TipBox>
          콜론(:)은 네임스페이스를 나타냅니다. 실제로는 전체 URI를 사용하지만, 
          여기서는 간단하게 표현하기 위해 축약형을 사용합니다.
        </TipBox>
      </HelpSection>

      <HelpSection icon={<Edit className="w-5 h-5 text-blue-500" />} title="2. 트리플 편집/삭제">
        <ul className="list-disc list-inside space-y-2">
          <li>트리플 목록에서 <Edit className="inline w-4 h-4" /> 버튼을 클릭하여 수정</li>
          <li><Trash2 className="inline w-4 h-4" /> 버튼을 클릭하여 삭제</li>
          <li>트리플을 클릭하면 그래프에서 해당 노드가 강조됩니다</li>
        </ul>
      </HelpSection>

      <HelpSection icon={<Network className="w-5 h-5 text-purple-500" />} title="3. 그래프 시각화">
        <p>입력한 트리플은 자동으로 지식 그래프로 시각화됩니다.</p>
        
        <ul className="list-disc list-inside space-y-2">
          <li><strong>노드 색상</strong>:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>🟢 녹색: 리소스 (개체)</li>
              <li>🟠 주황색: 리터럴 (값)</li>
              <li>🔵 파란색: 선택된 노드</li>
            </ul>
          </li>
          <li><strong>상호작용</strong>:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li><MousePointer className="inline w-4 h-4" /> 노드 드래그: 위치 이동</li>
              <li>마우스 휠: 확대/축소</li>
              <li>배경 드래그: 전체 이동</li>
            </ul>
          </li>
        </ul>
      </HelpSection>

      <HelpSection icon={<Zap className="w-5 h-5 text-yellow-500" />} title="4. 추론 엔진">
        <p>추론 엔진은 입력된 트리플로부터 새로운 사실을 자동으로 추론합니다.</p>
        
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">대칭 속성</h4>
            <p className="text-sm">A가 B를 안다면, B도 A를 안다</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              :철수 :knows :영희 → :영희 :knows :철수
            </code>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">이행 속성</h4>
            <p className="text-sm">A→B이고 B→C이면 A→C</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              :A :subClassOf :B + :B :subClassOf :C → :A :subClassOf :C
            </code>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold">타입 추론</h4>
            <p className="text-sm">속성의 도메인/레인지로부터 타입 추론</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              :김교수 :teaches :CS101 → :김교수 type :Teacher
            </code>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold">역관계</h4>
            <p className="text-sm">관계의 반대 방향 추론</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              :부모 :hasChild :자식 → :자식 :hasParent :부모
            </code>
          </div>
        </div>
        
        <TipBox>
          추론된 트리플은 노란색 배경으로 표시되며, 신뢰도(%)와 추론 근거가 함께 표시됩니다.
        </TipBox>
      </HelpSection>

      <HelpSection icon={<Download className="w-5 h-5 text-gray-500" />} title="5. 데이터 관리">
        <ul className="list-disc list-inside space-y-2">
          <li><FileCode2 className="inline w-4 h-4" /> <strong>샘플 가져오기</strong>: 미리 준비된 온톨로지 예제 불러오기</li>
          <li><Download className="inline w-4 h-4" /> <strong>내보내기</strong>: 트리플을 JSON 파일로 저장</li>
          <li><Upload className="inline w-4 h-4" /> <strong>가져오기</strong>: JSON 파일에서 트리플 불러오기</li>
          <li><Trash2 className="inline w-4 h-4" /> <strong>전체 삭제</strong>: 모든 트리플 제거</li>
        </ul>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
          <p className="text-sm font-semibold mb-2">제공되는 샘플 온톨로지:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li><strong>기본 온톨로지</strong>: 사람과 조직 관계</li>
            <li><strong>FOAF</strong>: 소셜 네트워크와 친구 관계</li>
            <li><strong>학술 도메인</strong>: 대학, 교수, 학생, 강좌</li>
            <li><strong>전자상거래</strong>: 상품, 고객, 주문</li>
            <li><strong>시맨틱 웹 기본</strong>: RDF/RDFS/OWL 구조</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mt-3">
          <p className="text-sm font-semibold mb-2">JSON 형식 예시:</p>
          <pre className="text-xs overflow-x-auto">{`[
  {
    "subject": ":홍길동",
    "predicate": ":직업",
    "object": ":개발자",
    "type": "resource"
  },
  {
    "subject": ":홍길동",
    "predicate": ":나이",
    "object": "30",
    "type": "literal"
  }
]`}</pre>
        </div>
      </HelpSection>

      <HelpSection title="6. 실습 예제">
        <p>다음 예제를 따라해보며 RDF 트리플의 개념을 익혀보세요:</p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold">예제: 가족 관계 표현하기</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>:아버지 :hasChild :아들</li>
            <li>:아버지 :hasChild :딸</li>
            <li>:아들 :siblingOf :딸</li>
            <li>:아버지 :marriedTo :어머니</li>
            <li>:아들 :hasAge "15" (리터럴 선택)</li>
          </ol>
          <p className="text-sm mt-3">
            추론 엔진이 자동으로 역관계와 대칭 관계를 추론하는 것을 확인해보세요!
          </p>
        </div>
      </HelpSection>
    </HelpModal>
  );
};