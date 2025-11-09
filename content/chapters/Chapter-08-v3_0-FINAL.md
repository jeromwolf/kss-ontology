# Chapter 8: 제조 온톨로지

**학습 시간:** 90분  
**난이도:** ⭐⭐⭐⭐⭐  
**시뮬레이터:** 3D Knowledge Graph ⭐  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL

---

## 🎯 학습 목표

이 챕터를 마치면 다음을 할 수 있습니다:

1. ✅ Palantir Foundry Ontology의 3-Layer 아키텍처를 이해한다
2. ✅ Industry 4.0 개념과 온톨로지의 역할을 설명한다
3. ✅ 스마트 팩토리 온톨로지를 설계한다
4. ✅ 실제 제조사 사례 (Airbus, Ferrari, BMW, Siemens)를 분석한다
5. ✅ IoT 센서 데이터와 온톨로지를 통합한다
6. ✅ 디지털 트윈 개념과 구현을 이해한다
7. ✅ Palantir + NVIDIA 협업 (2025년 1월)의 의미를 파악한다

---

## 📚 목차

1. [제조 온톨로지란?](#1-제조-온톨로지란)
2. [Industry 4.0과 온톨로지](#2-industry-40과-온톨로지)
3. [Palantir Foundry Ontology](#3-palantir-foundry-ontology)
4. [스마트 팩토리 온톨로지](#4-스마트-팩토리-온톨로지)
5. [IoT 센서 통합](#5-iot-센서-통합)
6. [생산 공정 모델링](#6-생산-공정-모델링)
7. [품질 관리](#7-품질-관리)
8. [실제 제조사 사례](#8-실제-제조사-사례)
9. [디지털 트윈](#9-디지털-트윈)
10. [실습: 공장 온톨로지](#10-실습-공장-온톨로지)
11. [Palantir + NVIDIA](#11-palantir--nvidia)
12. [요약과 다음 단계](#12-요약과-다음-단계)

---

## 1. 제조 온톨로지란?

### 제조 온톨로지의 정의

**제조 온톨로지**는 제조업의 모든 요소(설비, 공정, 자재, 품질, 인력)를 표준화하여 표현한 지식 모델입니다.

### 왜 제조업에서 온톨로지가 필요한가?

**1. 복잡한 생산 공정**
```
자동차 제조 예시:
- 3만+ 부품
- 수천 개의 공정 단계
- 수백 개의 공급업체
- 실시간 품질 검사
- 글로벌 공장 네트워크
```

**2. 데이터 사일로 문제**
```
제조 현장의 시스템:
- ERP (전사 자원 관리)
- MES (제조 실행 시스템)
- SCADA (감시 제어)
- PLM (제품 수명 관리)
- QMS (품질 관리)

→ 각 시스템이 독립적으로 운영
→ 데이터 통합 불가능
```

**3. Industry 4.0 요구사항**
```
4차 산업혁명:
- IoT 센서 수천 개
- 실시간 데이터 분석
- AI 기반 최적화
- 디지털 트윈
- 자율 생산 라인

→ 통합 데이터 모델 필수
```

**4. 공급망 복잡성**
```
글로벌 제조:
- 다국적 공급업체
- Just-In-Time 생산
- 실시간 재고 관리
- 품질 추적

→ End-to-End 가시성 필요
```

### ROI 데이터

| 회사 | 프로젝트 | ROI | 기간 |
|------|---------|-----|------|
| **Airbus** | 생산 최적화 | 20% 생산성 향상 | 2022-2024 |
| **Ferrari** | 품질 관리 | 결함 30% 감소 | 2023 |
| **BP** | 정유 공정 | $1B 비용 절감 | 2020-2023 |
| **BMW** | 공급망 | 15% 재고 감축 | 2023 |

---

## 2. Industry 4.0과 온톨로지

### Industry 4.0이란?

**Industry 4.0 (4차 산업혁명)**는 제조업의 디지털 전환을 의미합니다.

**발전 단계:**
```
Industry 1.0 (1784): 증기기관 → 기계화
Industry 2.0 (1870): 전기 → 대량 생산
Industry 3.0 (1969): 컴퓨터 → 자동화
Industry 4.0 (2011): 사이버-물리 시스템 → 스마트 팩토리
```

### Industry 4.0 핵심 기술 9가지

**1. IoT (사물 인터넷)**
```turtle
:Sensor_001 a :IoTSensor ;
    :type "Temperature" ;
    :location :Machine_A ;
    :frequency 1000 .  # 1초당 1회
```

**2. 빅데이터 분석**
```turtle
:Analytics_Engine a :BigDataSystem ;
    :processes :Sensor_001 ;
    :algorithm "Predictive Maintenance" ;
    :accuracy 95 .
```

**3. AI/ML**
```turtle
:AI_Model a :MachineLearningModel ;
    :task "Quality Prediction" ;
    :framework "TensorFlow" ;
    :accuracy 98 .
```

**4. 클라우드**
```turtle
:Cloud_Platform a :CloudService ;
    :provider "AWS" ;
    :stores :Production_Data ;
    :region "ap-northeast-2" .
```

**5. 사이버 보안**
```turtle
:Security_Layer a :CyberSecurity ;
    :protects :Production_Line ;
    :encryption "AES-256" ;
    :firewall true .
```

**6. 로봇 자동화**
```turtle
:Robot_001 a :IndustrialRobot ;
    :manufacturer "KUKA" ;
    :task "Welding" ;
    :workStation :Assembly_Line_1 .
```

**7. 시뮬레이션**
```turtle
:Digital_Twin a :Simulation ;
    :represents :Physical_Factory ;
    :updateFrequency "Real-time" ;
    :accuracy 99 .
```

**8. 시스템 통합**
```turtle
:ERP_System :integratesWith :MES_System .
:MES_System :integratesWith :SCADA_System .
```

**9. 증강 현실 (AR)**
```turtle
:AR_Device a :AugmentedReality ;
    :assists :Maintenance_Worker ;
    :displays :Maintenance_Manual .
```

### 온톨로지의 역할

**Industry 4.0에서 온톨로지는:**
1. **데이터 통합**: 모든 시스템의 데이터를 하나의 모델로
2. **의미 부여**: 센서 데이터에 컨텍스트 추가
3. **추론**: 실시간 의사결정 지원
4. **상호운용성**: 다른 시스템 간 소통 가능

---

## 3. Palantir Foundry Ontology

### Palantir란?

**Palantir Technologies**는 데이터 통합 및 분석 플랫폼을 제공하는 회사입니다.

**창립:** 2003년  
**창업자:** Peter Thiel, Alex Karp  
**주요 고객:** 
- 정부: CIA, FBI, NSA, 국방부
- 기업: Airbus, BP, Ferrari, Merck

### Foundry Ontology 개요

**Foundry Ontology**는 Palantir의 핵심 데이터 모델입니다.

**특징:**
- 3-Layer 아키텍처
- 코드 없이 온톨로지 구축
- 실시간 데이터 통합
- AI/ML 네이티브 지원

### 3-Layer 아키텍처

#### Layer 1: Semantic Layer (의미 계층)

**Object Types (객체 타입)**
```python
# Palantir 예제 (Python SDK)
from foundry import Object

@Object
class Machine:
    machine_id: str
    name: str
    location: str
    status: str  # Running, Idle, Maintenance
    manufacturer: str

@Object
class Sensor:
    sensor_id: str
    type: str  # Temperature, Pressure, Vibration
    unit: str
    machine: Machine  # 관계
```

**Link Types (관계 타입)**
```python
from foundry import Link

@Link(source=Machine, target=Sensor)
class HasSensor:
    installed_date: datetime
    calibration_date: datetime

@Link(source=Machine, target=Machine)
class SuppliesTo:
    material: str
    quantity: int
```

**Property Types (속성 타입)**
```python
@Object
class Product:
    product_id: str
    name: str
    weight: float  # kg
    dimensions: str  # "100x50x30 cm"
    quality_score: int  # 0-100
```

#### Layer 2: Kinetic Layer (동적 계층)

**Action Types (액션 타입)**
```python
from foundry import Action

@Action
class StartMachine:
    machine: Machine
    operator: str
    timestamp: datetime
    
    def validate(self):
        # 검증 로직
        return self.machine.status == "Idle"
    
    def execute(self):
        # 실행 로직
        self.machine.status = "Running"
        log_event("Machine started", self.machine.machine_id)

@Action
class ScheduleMaintenance:
    machine: Machine
    maintenance_type: str
    scheduled_date: datetime
    technician: str
    
    def execute(self):
        self.machine.status = "Maintenance"
        create_work_order(self.machine, self.technician)
```

**Workflows (워크플로우)**
```python
from foundry import Workflow

@Workflow
class ProductionWorkflow:
    def steps(self):
        return [
            check_material_availability,
            allocate_machine,
            start_production,
            quality_check,
            package_product
        ]
```

#### Layer 3: Dynamic Layer (동적 계층)

**Real-time Data Streams**
```python
from foundry import Stream

@Stream
class SensorDataStream:
    sensor: Sensor
    value: float
    timestamp: datetime
    
    @classmethod
    def from_iot(cls, mqtt_message):
        # MQTT → Foundry
        return cls(
            sensor=Sensor.get(mqtt_message.sensor_id),
            value=mqtt_message.value,
            timestamp=mqtt_message.timestamp
        )
```

**Machine Learning Integration**
```python
from foundry import MLModel

@MLModel
class PredictiveMaintenanceModel:
    def predict(self, machine: Machine):
        # 센서 데이터 가져오기
        sensor_data = get_recent_data(machine.sensors, days=7)
        
        # 예측
        failure_probability = self.model.predict(sensor_data)
        
        # 높은 확률이면 정비 예약
        if failure_probability > 0.7:
            ScheduleMaintenance(
                machine=machine,
                maintenance_type="Preventive",
                scheduled_date=tomorrow(),
                technician=assign_technician()
            ).execute()
```

### Foundry 실제 구현 예제

**Airbus 항공기 제조 온톨로지:**

```turtle
@prefix airbus: <http://airbus.example.org/> .

# 항공기 부품
airbus:Wing_Assembly a airbus:Component ;
    rdfs:label "Wing Assembly"@en ;
    airbus:partNumber "A350-WG-001" ;
    airbus:status "In Production" ;
    airbus:producedAt airbus:Toulouse_Factory .

# 생산 라인
airbus:Assembly_Line_1 a airbus:ProductionLine ;
    rdfs:label "Final Assembly Line 1"@en ;
    airbus:capacity 5 ;  # 5 aircraft/month
    airbus:currentLoad 4 .

# 워크스테이션
airbus:Station_101 a airbus:WorkStation ;
    rdfs:label "Wing Installation Station"@en ;
    airbus:partOf airbus:Assembly_Line_1 ;
    airbus:operation "Wing Assembly" .

# 작업자
airbus:Worker_A123 a airbus:Worker ;
    rdfs:label "Jean Dupont"@en ;
    airbus:certification "A350 Wing Assembly" ;
    airbus:assignedTo airbus:Station_101 .

# 관계
airbus:Wing_Assembly airbus:assembledAt airbus:Station_101 .
airbus:Station_101 airbus:operatedBy airbus:Worker_A123 .
```

---

## 4. 스마트 팩토리 온톨로지

### 스마트 팩토리 개념

**스마트 팩토리**는 IoT, AI, 로봇을 통합한 자동화된 생산 시설입니다.

### 핵심 요소 모델링

**1. 공장 구조**
```turtle
@prefix factory: <http://factory.example.org/> .

# 공장
factory:Plant_Seoul a factory:Plant ;
    rdfs:label "서울 공장"@ko ;
    factory:location "서울시 금천구" ;
    factory:area 50000 ;  # m²
    factory:established "2020-01-01"^^xsd:date .

# 건물
factory:Building_A a factory:Building ;
    rdfs:label "A동"@ko ;
    factory:partOf factory:Plant_Seoul ;
    factory:floors 3 ;
    factory:area 15000 .  # m²

# 생산 라인
factory:Line_1 a factory:ProductionLine ;
    rdfs:label "생산 라인 1"@ko ;
    factory:locatedIn factory:Building_A ;
    factory:product factory:Smartphone_X ;
    factory:capacity 1000 .  # units/day
```

**2. 설비**
```turtle
# CNC 기계
factory:CNC_001 a factory:CNCMachine ;
    rdfs:label "CNC 밀링 머신 001"@ko ;
    factory:manufacturer "DMG MORI" ;
    factory:model "NHX5000" ;
    factory:serialNumber "NH5-2023-001" ;
    factory:installedDate "2023-05-15"^^xsd:date ;
    factory:locatedAt factory:Line_1 ;
    factory:status "Running" ;
    factory:utilization 85 .  # 85%

# 로봇
factory:Robot_001 a factory:IndustrialRobot ;
    rdfs:label "용접 로봇 001"@ko ;
    factory:manufacturer "KUKA" ;
    factory:model "KR 500" ;
    factory:task "Welding" ;
    factory:payload 500 ;  # kg
    factory:reach 3200 .  # mm
```

**3. 센서**
```turtle
# 온도 센서
factory:Temp_Sensor_001 a factory:TemperatureSensor ;
    rdfs:label "온도 센서 001"@ko ;
    factory:attachedTo factory:CNC_001 ;
    factory:range "-20 to 150" ;  # °C
    factory:unit "Celsius" ;
    factory:accuracy 0.1 ;
    factory:samplingRate 1000 .  # 1초당 1회

# 진동 센서
factory:Vib_Sensor_001 a factory:VibrationSensor ;
    factory:attachedTo factory:CNC_001 ;
    factory:range "0 to 100" ;  # mm/s
    factory:unit "mm/s" ;
    factory:accuracy 0.01 .
```

**4. 자재**
```turtle
# 원자재
factory:Steel_Sheet_001 a factory:RawMaterial ;
    rdfs:label "강판 001"@ko ;
    factory:materialType "Steel" ;
    factory:grade "SPCC" ;
    factory:thickness 1.0 ;  # mm
    factory:quantity 1000 ;  # sheets
    factory:supplier factory:Supplier_A ;
    factory:lotNumber "LOT-2024-001" .

# 완제품
factory:Product_A001 a factory:FinishedProduct ;
    rdfs:label "제품 A001"@ko ;
    factory:productCode "PRD-A001" ;
    factory:producedAt factory:Line_1 ;
    factory:productionDate "2024-11-09"^^xsd:date ;
    factory:quality "Pass" ;
    factory:weight 500 .  # g
```

---

## 5. IoT 센서 통합

### 센서 데이터 모델링

**센서 클래스 계층:**
```turtle
factory:Sensor a owl:Class ;
    rdfs:label "Sensor"@en .

factory:TemperatureSensor rdfs:subClassOf factory:Sensor .
factory:PressureSensor rdfs:subClassOf factory:Sensor .
factory:VibrationSensor rdfs:subClassOf factory:Sensor .
factory:ProximitySensor rdfs:subClassOf factory:Sensor .
factory:FlowSensor rdfs:subClassOf factory:Sensor .
```

### 실시간 데이터 스트림

**센서 데이터 예제:**
```turtle
# 센서 읽기 (Reading)
factory:Reading_001 a factory:SensorReading ;
    factory:sensor factory:Temp_Sensor_001 ;
    factory:value 75.5 ;
    factory:unit "Celsius" ;
    factory:timestamp "2024-11-09T10:30:00Z"^^xsd:dateTime ;
    factory:status "Normal" .

factory:Reading_002 a factory:SensorReading ;
    factory:sensor factory:Temp_Sensor_001 ;
    factory:value 95.2 ;
    factory:unit "Celsius" ;
    factory:timestamp "2024-11-09T10:31:00Z"^^xsd:dateTime ;
    factory:status "Warning" .  # 높은 온도!
```

### MQTT → 온톨로지 통합

**Python 코드:**
```python
import paho.mqtt.client as mqtt
from rdflib import Graph, Namespace, Literal, URIRef
from datetime import datetime

# 네임스페이스
FACTORY = Namespace("http://factory.example.org/")
g = Graph()

def on_message(client, userdata, msg):
    """MQTT 메시지 수신 → RDF로 변환"""
    # MQTT 메시지 파싱
    sensor_id = msg.topic.split("/")[1]  # sensors/TEMP001/data
    value = float(msg.payload.decode())
    
    # RDF 트리플 생성
    reading_uri = URIRef(f"http://factory.example.org/Reading_{datetime.now().timestamp()}")
    sensor_uri = URIRef(f"http://factory.example.org/{sensor_id}")
    
    g.add((reading_uri, FACTORY.sensor, sensor_uri))
    g.add((reading_uri, FACTORY.value, Literal(value)))
    g.add((reading_uri, FACTORY.timestamp, Literal(datetime.now())))
    
    # 임계값 확인
    if value > 90:
        g.add((reading_uri, FACTORY.status, Literal("Warning")))
        send_alert(sensor_id, value)
    else:
        g.add((reading_uri, FACTORY.status, Literal("Normal")))
    
    # Triple Store에 저장
    upload_to_triplestore(g)

# MQTT 클라이언트 설정
client = mqtt.Client()
client.on_message = on_message
client.connect("mqtt.factory.local", 1883)
client.subscribe("sensors/+/data")  # 모든 센서
client.loop_forever()
```

### 이상 탐지

**SPARQL 쿼리:**
```sparql
PREFIX factory: <http://factory.example.org/>

# 과거 1시간 동안 비정상 센서 찾기
SELECT ?sensor ?avgValue (COUNT(?reading) AS ?abnormalCount)
WHERE {
    ?reading factory:sensor ?sensor ;
             factory:value ?value ;
             factory:timestamp ?time ;
             factory:status "Warning" .
    
    FILTER(?time > NOW() - "PT1H"^^xsd:duration)  # 1시간
}
GROUP BY ?sensor
HAVING (AVG(?value) AS ?avgValue)
ORDER BY DESC(?abnormalCount)
```

---

## 6. 생산 공정 모델링

### 공정 온톨로지

```turtle
@prefix process: <http://process.example.org/> .

# 공정 클래스
process:Process a owl:Class ;
    rdfs:label "Manufacturing Process"@en .

process:Machining rdfs:subClassOf process:Process .
process:Assembly rdfs:subClassOf process:Process .
process:Welding rdfs:subClassOf process:Process .
process:Inspection rdfs:subClassOf process:Process .
process:Packaging rdfs:subClassOf process:Process .

# 공정 속성
process:duration a owl:DatatypeProperty ;
    rdfs:domain process:Process ;
    rdfs:range xsd:integer ;  # 분 단위
    rdfs:label "Duration (minutes)"@en .

process:requiredSkill a owl:DatatypeProperty ;
    rdfs:domain process:Process ;
    rdfs:range xsd:string .

process:machine a owl:ObjectProperty ;
    rdfs:domain process:Process ;
    rdfs:range factory:Machine .
```

### 생산 플로우 모델링

**자동차 도어 제조 예제:**

```turtle
# Step 1: 금속 절단
:Process_Cut a process:Machining ;
    rdfs:label "Door Panel Cutting"@en ;
    process:duration 5 ;  # 5분
    process:machine factory:CNC_001 ;
    process:input factory:Steel_Sheet_001 ;
    process:output :Door_Panel_Raw .

# Step 2: 성형
:Process_Form a process:Forming ;
    rdfs:label "Door Panel Forming"@en ;
    process:duration 10 ;
    process:machine factory:Press_001 ;
    process:input :Door_Panel_Raw ;
    process:output :Door_Panel_Formed .

# Step 3: 용접
:Process_Weld a process:Welding ;
    rdfs:label "Door Frame Welding"@en ;
    process:duration 15 ;
    process:machine factory:Robot_001 ;
    process:input :Door_Panel_Formed , :Door_Frame ;
    process:output :Door_Assembly .

# Step 4: 도장
:Process_Paint a process:Painting ;
    rdfs:label "Door Painting"@en ;
    process:duration 20 ;
    process:machine factory:Paint_Booth_001 ;
    process:input :Door_Assembly ;
    process:output :Door_Painted .

# Step 5: 검사
:Process_Inspect a process:Inspection ;
    rdfs:label "Quality Inspection"@en ;
    process:duration 5 ;
    process:machine factory:Vision_System_001 ;
    process:input :Door_Painted ;
    process:output :Door_Finished .

# 공정 순서
:Process_Cut process:nextStep :Process_Form .
:Process_Form process:nextStep :Process_Weld .
:Process_Weld process:nextStep :Process_Paint .
:Process_Paint process:nextStep :Process_Inspect .
```

### 공정 최적화 쿼리

```sparql
# 전체 생산 시간 계산
SELECT (SUM(?duration) AS ?totalTime)
WHERE {
    ?process a process:Process ;
             process:duration ?duration .
}

# 병목 공정 찾기 (가장 오래 걸리는 단계)
SELECT ?process ?duration
WHERE {
    ?process a process:Process ;
             process:duration ?duration .
}
ORDER BY DESC(?duration)
LIMIT 1
```

---

## 7. 품질 관리

### 품질 온톨로지

```turtle
@prefix quality: <http://quality.example.org/> .

# 품질 검사
quality:Inspection a owl:Class ;
    rdfs:label "Quality Inspection"@en .

quality:VisualInspection rdfs:subClassOf quality:Inspection .
quality:DimensionalInspection rdfs:subClassOf quality:Inspection .
quality:FunctionalTest rdfs:subClassOf quality:Inspection .

# 검사 항목
quality:InspectionPoint a owl:Class ;
    rdfs:label "Inspection Point"@en .

quality:dimension a owl:ObjectProperty ;
    rdfs:domain quality:InspectionPoint ;
    rdfs:range quality:Dimension .

quality:tolerance a owl:DatatypeProperty ;
    rdfs:domain quality:Dimension ;
    rdfs:range xsd:float .
```

### 품질 검사 예제

```turtle
# 도어 치수 검사
:Inspection_001 a quality:DimensionalInspection ;
    rdfs:label "Door Dimension Check"@en ;
    quality:product :Door_Finished ;
    quality:inspector :Worker_B001 ;
    quality:timestamp "2024-11-09T14:30:00Z"^^xsd:dateTime .

# 검사 항목 1: 길이
:Check_Length a quality:InspectionPoint ;
    quality:partOf :Inspection_001 ;
    quality:dimension :Door_Length ;
    quality:measuredValue 1200.5 ;  # mm
    quality:nominalValue 1200.0 ;
    quality:tolerance 2.0 ;  # ±2mm
    quality:result "Pass" .

# 검사 항목 2: 너비
:Check_Width a quality:InspectionPoint ;
    quality:partOf :Inspection_001 ;
    quality:dimension :Door_Width ;
    quality:measuredValue 800.8 ;  # mm
    quality:nominalValue 800.0 ;
    quality:tolerance 2.0 ;
    quality:result "Pass" .

# 검사 항목 3: 표면 결함
:Check_Surface a quality:InspectionPoint ;
    quality:partOf :Inspection_001 ;
    quality:dimension :Surface_Quality ;
    quality:defects 0 ;
    quality:result "Pass" .

# 최종 판정
:Inspection_001 quality:overallResult "Pass" ;
                quality:approvedBy :Quality_Manager_001 .
```

### 품질 추적

```sparql
# 특정 배치의 불량률
PREFIX quality: <http://quality.example.org/>

SELECT ?batch (COUNT(?inspection) AS ?total) 
       (SUM(IF(?result = "Fail", 1, 0)) AS ?defects)
       ((?defects / ?total * 100) AS ?defectRate)
WHERE {
    ?product factory:lotNumber ?batch ;
             quality:inspectedBy ?inspection .
    
    ?inspection quality:overallResult ?result .
}
GROUP BY ?batch
HAVING (?defectRate > 5.0)  # 불량률 5% 초과
ORDER BY DESC(?defectRate)
```

---

## 8. 실제 제조사 사례

### 1. Airbus - 항공기 제조

**프로젝트:** A350 생산 최적화 (Palantir Foundry)  
**기간:** 2022-2024  
**결과:** 20% 생산성 향상

**온톨로지 구조:**
```turtle
@prefix airbus: <http://airbus.example.org/> .

# 항공기 모델
airbus:A350_XWB a airbus:AircraftModel ;
    rdfs:label "Airbus A350 XWB"@en ;
    airbus:variants "A350-900" , "A350-1000" ;
    airbus:capacity 300-410 ;  # passengers
    airbus:range 15000 .  # km

# 주요 부품
airbus:Fuselage a airbus:MajorComponent ;
    rdfs:label "Fuselage"@en ;
    airbus:sections 13 ;
    airbus:material "Carbon Fiber Composite" .

airbus:Wing a airbus:MajorComponent ;
    rdfs:label "Wing"@en ;
    airbus:span 64.75 ;  # meters
    airbus:material "Aluminum-Lithium Alloy" .

# 공급업체
airbus:Supplier_RollsRoyce a airbus:Supplier ;
    rdfs:label "Rolls-Royce"@en ;
    airbus:supplies airbus:Engine_TrentXWB ;
    airbus:country "UK" .

# 생산 라인
airbus:FAL_Toulouse a airbus:FinalAssemblyLine ;
    rdfs:label "Final Assembly Line, Toulouse"@en ;
    airbus:capacity 10 ;  # aircraft/month
    airbus:location "Toulouse, France" .
```

**성과:**
- 부품 추적 시간: 2시간 → 10분
- 생산 리드타임: 18개월 → 14개월
- 품질 결함: 15% 감소

### 2. Ferrari - 스포츠카 제조

**프로젝트:** 품질 관리 시스템 (Palantir)  
**기간:** 2023  
**결과:** 결함 30% 감소

**온톨로지 구조:**
```turtle
@prefix ferrari: <http://ferrari.example.org/> .

# 차량 모델
ferrari:SF90_Stradale a ferrari:CarModel ;
    rdfs:label "SF90 Stradale"@en ;
    ferrari:engine "V8 Hybrid" ;
    ferrari:horsepower 1000 ;
    ferrari:topSpeed 340 ;  # km/h
    ferrari:price 500000 .  # USD

# 제조 공정
ferrari:Engine_Assembly a ferrari:Process ;
    rdfs:label "Engine Assembly"@en ;
    ferrari:location ferrari:Maranello_Factory ;
    ferrari:duration 8 ;  # hours
    ferrari:workers 5 .

# 품질 기준
ferrari:Quality_Standard a ferrari:QualitySpec ;
    ferrari:tolerance 0.01 ;  # mm
    ferrari:surfaceFinish "Mirror Polish" ;
    ferrari:paintThickness 120-150 .  # μm
```

### 3. BMW - 자동차 제조

**프로젝트:** 공급망 최적화  
**기간:** 2023  
**결과:** 15% 재고 감축

```turtle
@prefix bmw: <http://bmw.example.org/> .

# 공급망 네트워크
bmw:Supply_Chain a bmw:SupplyChainNetwork ;
    bmw:suppliers 12000 ;
    bmw:plants 31 ;
    bmw:countries 15 .

# Just-In-Time 배송
bmw:JIT_Delivery a bmw:LogisticsStrategy ;
    bmw:deliveryWindow 2 ;  # hours
    bmw:inventoryDays 3 ;  # days
    bmw:supplier bmw:Bosch .
```

### 4. Siemens - 스마트 팩토리

**프로젝트:** Digital Twin 구축  
**기간:** 2021-2023  
**결과:** 30% 에너지 절감

```turtle
@prefix siemens: <http://siemens.example.org/> .

# 디지털 트윈
siemens:Digital_Twin_Plant a siemens:DigitalTwin ;
    siemens:represents siemens:Amberg_Factory ;
    siemens:sensors 10000 ;
    siemens:updateRate 1000 ;  # ms
    siemens:accuracy 99.9 .

# 에너지 최적화
siemens:Energy_Management a siemens:EnergySystem ;
    siemens:consumption_reduction 30 ;  # %
    siemens:renewable_energy 60 ;  # %
    siemens:co2_reduction 25 .  # %
```

---

## 9. 디지털 트윈

### 디지털 트윈이란?

**디지털 트윈 (Digital Twin)**은 물리적 자산의 가상 복제본입니다.

**특징:**
- 실시간 동기화
- 시뮬레이션 가능
- 예측 분석
- 최적화

### 디지털 트윈 온톨로지

```turtle
@prefix dt: <http://digitaltwin.example.org/> .

# 디지털 트윈 클래스
dt:DigitalTwin a owl:Class ;
    rdfs:label "Digital Twin"@en .

dt:PhysicalAsset a owl:Class ;
    rdfs:label "Physical Asset"@en .

# 관계
dt:represents a owl:ObjectProperty ;
    rdfs:domain dt:DigitalTwin ;
    rdfs:range dt:PhysicalAsset .

dt:synchronized a owl:DatatypeProperty ;
    rdfs:domain dt:DigitalTwin ;
    rdfs:range xsd:boolean .
```

### 실시간 시뮬레이션

**예제: 생산 라인 디지털 트윈**

```turtle
# 물리적 자산
:Production_Line_1 a dt:PhysicalAsset ;
    rdfs:label "Production Line 1"@en ;
    factory:machines 10 ;
    factory:capacity 1000 ;  # units/day
    factory:currentSpeed 850 .  # units/day

# 디지털 트윈
:DT_Production_Line_1 a dt:DigitalTwin ;
    rdfs:label "Digital Twin of Line 1"@en ;
    dt:represents :Production_Line_1 ;
    dt:synchronized true ;
    dt:updateRate 1000 ;  # ms
    dt:lastUpdate "2024-11-09T15:00:00Z"^^xsd:dateTime .

# 센서 데이터 연결
:DT_Production_Line_1 dt:monitors [
    a dt:SensorData ;
    dt:sensor factory:Temp_Sensor_001 ;
    dt:value 75.5 ;
    dt:timestamp "2024-11-09T15:00:00Z"^^xsd:dateTime
] .

# 시뮬레이션 결과
:DT_Production_Line_1 dt:predicts [
    a dt:Prediction ;
    dt:metric "Production Volume" ;
    dt:timeframe "Next 1 hour" ;
    dt:predictedValue 85 ;  # units
    dt:confidence 0.95
] .
```

### Python 구현

```python
class DigitalTwin:
    def __init__(self, physical_asset):
        self.physical_asset = physical_asset
        self.sensors = []
        self.ml_model = load_model("predictive_model.h5")
    
    def sync(self):
        """물리적 자산과 동기화"""
        for sensor in self.sensors:
            latest_reading = sensor.get_latest_reading()
            self.update_state(sensor.id, latest_reading)
    
    def simulate(self, scenario):
        """시나리오 시뮬레이션"""
        # 현재 상태
        current_state = self.get_state()
        
        # 시나리오 적용
        simulated_state = apply_scenario(current_state, scenario)
        
        # 예측
        prediction = self.ml_model.predict(simulated_state)
        
        return prediction
    
    def optimize(self, objective):
        """최적화"""
        best_scenario = None
        best_result = float('-inf')
        
        # 다양한 시나리오 시뮬레이션
        for scenario in generate_scenarios():
            result = self.simulate(scenario)
            
            if result[objective] > best_result:
                best_result = result[objective]
                best_scenario = scenario
        
        return best_scenario, best_result

# 사용 예제
twin = DigitalTwin(production_line_1)
twin.sync()

# 생산량 최적화
best_scenario, max_output = twin.optimize("production_volume")
print(f"최적 시나리오: {best_scenario}")
print(f"예상 생산량: {max_output} units/hour")
```

---

## 10. 실습: 공장 온톨로지

### 🎮 3D Knowledge Graph 열기

URL: https://kss.ai.kr/3d-graph

### 실습 목표

**스마트 팩토리 생태계**를 3D로 시각화합니다: 공장, 생산 라인, 기계, 센서, 제품.

### Step 1: 데이터 준비

```turtle
@prefix : <http://factory.example.org/> .
@prefix factory: <http://factory.example.org/> .

# 공장
:Plant_Seoul a factory:Plant ;
    rdfs:label "서울 공장"@ko ;
    factory:location "서울시 금천구" ;
    factory:area 50000 .

# 생산 라인
:Line_1 a factory:ProductionLine ;
    rdfs:label "생산 라인 1"@ko ;
    factory:locatedIn :Plant_Seoul ;
    factory:capacity 1000 .

:Line_2 a factory:ProductionLine ;
    rdfs:label "생산 라인 2"@ko ;
    factory:locatedIn :Plant_Seoul ;
    factory:capacity 800 .

# 기계
:CNC_001 a factory:CNCMachine ;
    rdfs:label "CNC 001"@ko ;
    factory:locatedAt :Line_1 ;
    factory:status "Running" ;
    factory:utilization 85 .

:Robot_001 a factory:IndustrialRobot ;
    rdfs:label "로봇 001"@ko ;
    factory:locatedAt :Line_1 ;
    factory:task "Welding" .

:Press_001 a factory:PressMachine ;
    rdfs:label "프레스 001"@ko ;
    factory:locatedAt :Line_2 ;
    factory:status "Idle" .

# 센서
:Temp_001 a factory:TemperatureSensor ;
    rdfs:label "온도 센서 001"@ko ;
    factory:attachedTo :CNC_001 ;
    factory:currentValue 75.5 .

:Vib_001 a factory:VibrationSensor ;
    rdfs:label "진동 센서 001"@ko ;
    factory:attachedTo :CNC_001 ;
    factory:currentValue 12.3 .

# 제품
:Product_A a factory:Product ;
    rdfs:label "제품 A"@ko ;
    factory:producedBy :Line_1 ;
    factory:quantity 500 .

# 관계
:Line_1 factory:contains :CNC_001 , :Robot_001 .
:Line_2 factory:contains :Press_001 .

:CNC_001 factory:hasSensor :Temp_001 , :Vib_001 .

:Plant_Seoul factory:produces :Product_A .
```

### Step 2: 3D Graph 로드

1. "Import Data" 클릭
2. Turtle 데이터 붙여넣기
3. "Load Graph" 클릭

### Step 3: 시각화 확인

**노드 색상:**
- 🏭 공장: 파랑
- 🔧 생산 라인: 초록
- ⚙️ 기계: 빨강
- 📡 센서: 노랑
- 📦 제품: 보라

**그래프 구조:**
```
[서울 공장]
  ├─ [생산 라인 1]
  │    ├─ [CNC 001]
  │    │    ├─ [온도 센서 001]
  │    │    └─ [진동 센서 001]
  │    └─ [로봇 001]
  └─ [생산 라인 2]
       └─ [프레스 001]

[제품 A] <── producedBy ── [생산 라인 1]
```

### Step 4: SPARQL 쿼리

```sparql
# 공장의 총 생산 능력
SELECT (SUM(?capacity) AS ?totalCapacity)
WHERE {
    ?line a factory:ProductionLine ;
          factory:capacity ?capacity .
}

# 결과: 1,800 units/day
```

```sparql
# 가동 중인 기계 찾기
SELECT ?machine ?status
WHERE {
    ?machine a factory:Machine ;
             factory:status ?status .
    
    FILTER(?status = "Running")
}
```

### Step 5: 이상 탐지

```sparql
# 고온 경보
SELECT ?machine ?sensor ?temp
WHERE {
    ?sensor a factory:TemperatureSensor ;
            factory:attachedTo ?machine ;
            factory:currentValue ?temp .
    
    FILTER(?temp > 80)  # 80°C 초과
}
```

---

## 11. Palantir + NVIDIA

### 협업 발표 (2025년 1월)

**2025년 1월**, Palantir와 NVIDIA가 전략적 파트너십을 발표했습니다.

**목표:** AI + 온톨로지 통합으로 제조업 혁신

### 핵심 기술

**1. Ontology-Augmented Generation (OAG)**
```
Palantir Foundry Ontology + NVIDIA NIM
→ LLM이 온톨로지를 참조하여 정확한 답변 생성
```

**2. Digital Twin AI**
```
NVIDIA Omniverse + Palantir Ontology
→ 실시간 3D 디지털 트윈 + AI 최적화
```

**3. Graph Neural Networks (GNN)**
```
NVIDIA cuGraph + Palantir Knowledge Graph
→ 복잡한 관계 분석 (공급망, 품질 추적)
```

### 사용 사례

**1. 예측 정비**
```python
# Palantir Ontology에서 기계 정보 가져오기
machine_data = foundry.get_object("Machine_001")

# NVIDIA AI로 고장 예측
failure_prob = nvidia_model.predict(machine_data)

if failure_prob > 0.7:
    # Palantir에 정비 액션 생성
    foundry.create_action(
        "ScheduleMaintenance",
        machine=machine_data,
        date=tomorrow()
    )
```

**2. 품질 예측**
```python
# 온톨로지에서 공정 데이터 가져오기
process_params = foundry.query("""
    SELECT ?param ?value
    WHERE {
        :Process_001 factory:parameter ?param ;
                     factory:value ?value .
    }
""")

# NVIDIA AI로 품질 예측
quality_score = nvidia_model.predict(process_params)

if quality_score < 90:
    # 공정 파라미터 자동 조정
    optimize_parameters(process_params)
```

**3. 공급망 최적화**
```python
# 전체 공급망 그래프
supply_chain = foundry.get_supply_chain_graph()

# NVIDIA cuGraph로 병목 찾기
bottlenecks = nvidia_cugraph.find_bottlenecks(supply_chain)

# 최적 경로 계산
optimal_routes = nvidia_cugraph.optimize_routes(supply_chain)
```

### ROI 예측

| 영역 | 개선 효과 | 비용 절감 |
|------|----------|----------|
| 예측 정비 | 다운타임 40% 감소 | $5M/년 |
| 품질 관리 | 불량률 50% 감소 | $3M/년 |
| 공급망 | 재고 30% 감축 | $7M/년 |
| 에너지 | 소비 25% 감소 | $2M/년 |
| **총합** | - | **$17M/년** |

---

## 12. 요약과 다음 단계

### 핵심 정리

**1. 제조 온톨로지**
- 공장, 기계, 센서, 공정, 제품 모델링
- Industry 4.0 필수 기술
- 데이터 통합 및 상호운용성

**2. Palantir Foundry Ontology**
- 3-Layer 아키텍처
  * Semantic: Object/Link/Property Types
  * Kinetic: Action Types, Workflows
  * Dynamic: Real-time Streams, ML
- Airbus, Ferrari, BP 실제 사례

**3. 스마트 팩토리**
- IoT 센서 통합
- 실시간 모니터링
- 예측 정비
- 품질 관리

**4. 디지털 트윈**
- 물리적 자산의 가상 복제본
- 실시간 동기화
- 시뮬레이션 및 최적화
- Siemens 30% 에너지 절감

**5. Palantir + NVIDIA**
- OAG (Ontology-Augmented Generation)
- Digital Twin AI
- GNN (Graph Neural Networks)
- $17M/년 비용 절감 예측

### 실전 체크리스트

**제조 온톨로지 프로젝트 시:**
- [ ] 공장 구조 모델링
- [ ] 설비 및 센서 정의
- [ ] 생산 공정 매핑
- [ ] 품질 기준 설정
- [ ] 실시간 데이터 통합
- [ ] 디지털 트윈 구축
- [ ] AI/ML 통합

### 다음 챕터

**Chapter 9: AI + 온톨로지 (Graph RAG)**

AI 시대의 필수 기술!
- **Graph RAG** (Retrieval-Augmented Generation)
- LLM Hallucination 해결
- Vector DB + Knowledge Graph 통합
- OpenAI, Google, Anthropic 접근법
- Neuro-Symbolic AI
- **3D Knowledge Graph로 RAG 시각화!**

---

## 📝 연습 문제

### 문제 1: Palantir 3-Layer

Palantir Foundry Ontology의 3-Layer를 설명하고 각 레이어의 역할을 기술하세요.

**정답:**
1. **Semantic Layer**: Object Types, Link Types, Property Types 정의 (정적 구조)
2. **Kinetic Layer**: Action Types, Workflows 정의 (동적 행위)
3. **Dynamic Layer**: Real-time Streams, ML Models (실시간 데이터 및 AI)

### 문제 2: 디지털 트윈

디지털 트윈의 핵심 특징 4가지를 나열하세요.

**정답:**
1. 실시간 동기화
2. 시뮬레이션 가능
3. 예측 분석
4. 최적화

### 문제 3: 센서 쿼리

과거 1시간 동안 온도가 80°C를 초과한 센서를 찾는 SPARQL 쿼리를 작성하세요.

**정답:**
```sparql
PREFIX factory: <http://factory.example.org/>

SELECT ?sensor ?temp ?time
WHERE {
    ?reading factory:sensor ?sensor ;
             factory:value ?temp ;
             factory:timestamp ?time .
    
    ?sensor a factory:TemperatureSensor .
    
    FILTER(?temp > 80)
    FILTER(?time > NOW() - "PT1H"^^xsd:duration)
}
ORDER BY DESC(?temp)
```

---

## 🔗 참고 자료

### 플랫폼
1. Palantir Foundry: https://www.palantir.com/platforms/foundry/
2. NVIDIA Omniverse: https://www.nvidia.com/en-us/omniverse/
3. Siemens Digital Industries: https://www.siemens.com/digital/

### 표준
1. Industry 4.0: https://www.plattform-i40.de/
2. ISA-95: https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95
3. OPC UA: https://opcfoundation.org/

### 사례
1. Airbus: https://www.airbus.com/
2. Ferrari: https://www.ferrari.com/
3. BMW: https://www.bmwgroup.com/

---

**다음:** [Chapter 9: AI + 온톨로지](./chapter-09.md)

**작성자:** jeromwolf (데이터공작소 TFT)  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL  
**단어 수:** 약 6,700단어
