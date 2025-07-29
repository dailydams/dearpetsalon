-- 사용자 테이블 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'groomer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 고객 테이블
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guardian_name TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  species TEXT,
  weight DECIMAL,
  memo TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 서비스 테이블
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_ids UUID[] NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  color TEXT DEFAULT '#8B5CF6',
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  total_price INTEGER,
  memo TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림톡 템플릿 테이블
CREATE TABLE notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 고객 정책
CREATE POLICY "Authenticated users can manage customers" ON customers FOR ALL USING (auth.role() = 'authenticated');

-- 서비스 정책
CREATE POLICY "Authenticated users can view services" ON services FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users can manage services" ON services FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 예약 정책
CREATE POLICY "Authenticated users can manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- 알림톡 템플릿 정책
CREATE POLICY "Admin users can manage notification templates" ON notification_templates FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 기본 서비스 데이터 삽입
INSERT INTO services (name, duration_hours, price) VALUES
('목욕', 1, 30000),
('부분미용', 1, 25000),
('전체미용', 2, 50000),
('스포팅', 3, 70000),
('올컷', 3, 80000);

-- 기본 알림톡 템플릿 삽입
INSERT INTO notification_templates (name, template) VALUES
('예약 확인', '안녕하세요 디어펫살롱입니다.\n\n예약이 확정되었습니다.\n\n일시: {date} {time}\n반려견: {pet_name}\n서비스: {services}\n\n감사합니다.'),
('예약 변경', '안녕하세요 디어펫살롱입니다.\n\n예약이 변경되었습니다.\n\n변경된 일시: {date} {time}\n반려견: {pet_name}\n서비스: {services}\n\n감사합니다.');

-- 인덱스 생성
CREATE INDEX idx_customers_guardian_name ON customers(guardian_name);
CREATE INDEX idx_customers_pet_name ON customers(pet_name);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_created_by ON bookings(created_by);