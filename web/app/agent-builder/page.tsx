'use client'

/**
 * Agent Builder 시뮬레이터
 * OpenAI Agent Builder와 유사한 인터페이스
 */

import { useState } from 'react'
import { Send, Play, Save, Settings, Database, TrendingUp, FileText } from 'lucide-react'

interface AgentConfig {
  name: string
  role: string
  instructions: string
  tools: string[]
  temperature: number
  maxTokens: number
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function AgentBuilderPage() {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: 'KSS 공급망 분석가',
    role: '공급망 네트워크 전문가',
    instructions: `당신은 한국 공급망 네트워크 분석 전문가입니다.

주요 역할:
- 공급망 관계 분석 및 설명
- 리스크 식별 및 평가
- 데이터 기반 인사이트 제공
- 실행 가능한 추천사항 생성

항상 데이터에 기반하여 객관적이고 정확한 답변을 제공하세요.`,
    tools: ['ontology_query', 'analytics', 'insights'],
    temperature: 0.7,
    maxTokens: 2000,
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: '안녕하세요! KSS 공급망 분석가입니다. 무엇을 도와드릤까요?',
      timestamp: new Date(),
    },
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure')

  const availableTools = [
    {
      id: 'ontology_query',
      name: '온톨로지 쿼리',
      description: '지식 그래프에서 관계 검색',
      icon: Database,
    },
    {
      id: 'analytics',
      name: '통계 분석',
      description: '공급망 통계 및 추이 분석',
      icon: TrendingUp,
    },
    {
      id: 'insights',
      name: 'AI 인사이트',
      description: '자동 분석 및 추천',
      icon: FileText,
    },
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Agent API 호출
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: agentConfig,
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Agent chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAgent = async () => {
    try {
      const response = await fetch('/api/agent/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentConfig),
      })

      const data = await response.json()
      if (data.success) {
        alert('Agent가 성공적으로 저장되었습니다!')
      }
    } catch (error) {
      console.error('Save agent error:', error)
      alert('Agent 저장 중 오류가 발생했습니다.')
    }
  }

  const toggleTool = (toolId: string) => {
    setAgentConfig((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter((t) => t !== toolId)
        : [...prev.tools, toolId],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Builder</h1>
              <p className="text-sm text-gray-600">
                맞춤형 AI Agent를 생성하고 테스트하세요
              </p>
            </div>
            <button
              onClick={handleSaveAgent}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('configure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'configure'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              설정
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              미리보기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: Agent 설정 */}
          {activeTab === 'configure' && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent 이름
                    </label>
                    <input
                      type="text"
                      value={agentConfig.name}
                      onChange={(e) =>
                        setAgentConfig({ ...agentConfig, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: 공급망 분석가"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      역할
                    </label>
                    <input
                      type="text"
                      value={agentConfig.role}
                      onChange={(e) =>
                        setAgentConfig({ ...agentConfig, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: 공급망 전문가"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      지시사항
                    </label>
                    <textarea
                      value={agentConfig.instructions}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          instructions: e.target.value,
                        })
                      }
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Agent의 역할과 행동 방식을 설명하세요..."
                    />
                  </div>
                </div>
              </div>

              {/* 도구 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">사용 가능한 도구</h3>
                <div className="space-y-3">
                  {availableTools.map((tool) => {
                    const Icon = tool.icon
                    const isActive = agentConfig.tools.includes(tool.id)
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mt-0.5 ${
                            isActive ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                        <div className="flex-1 text-left">
                          <div
                            className={`font-medium ${
                              isActive ? 'text-blue-900' : 'text-gray-900'
                            }`}
                          >
                            {tool.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {tool.description}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isActive
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isActive && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 고급 설정 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">고급 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature: {agentConfig.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={agentConfig.temperature}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>정확함</span>
                      <span>창의적</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 토큰: {agentConfig.maxTokens}
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={agentConfig.maxTokens}
                      onChange={(e) =>
                        setAgentConfig({
                          ...agentConfig,
                          maxTokens: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 오른쪽: 채팅 미리보기 */}
          <div className="bg-white rounded-lg shadow flex flex-col h-[800px]">
            <div className="p-4 border-b">
              <h3 className="font-semibold">{agentConfig.name}</h3>
              <p className="text-sm text-gray-600">{agentConfig.role}</p>
            </div>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.role === 'system'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('ko-KR')}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 입력창 */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
