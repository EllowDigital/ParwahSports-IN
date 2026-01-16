-- Create membership plan status enum
CREATE TYPE public.plan_status AS ENUM ('active', 'inactive');

-- Create subscription status enum  
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending', 'paused');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

-- Create membership type enum
CREATE TYPE public.membership_type AS ENUM ('monthly', 'yearly', 'lifetime');

-- Create membership_plans table
CREATE TABLE public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type membership_type NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    razorpay_plan_id TEXT,
    is_active BOOLEAN DEFAULT true,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    donor_address TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_status payment_status DEFAULT 'pending',
    payment_reference TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table (extends profiles for membership data)
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
    razorpay_subscription_id TEXT,
    status subscription_status DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table (for subscription payments)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES public.membership_plans(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_status payment_status DEFAULT 'pending',
    payment_type TEXT CHECK (payment_type IN ('subscription', 'one_time', 'lifetime')),
    payment_reference TEXT UNIQUE,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for membership_plans
CREATE POLICY "Anyone can view active plans" ON public.membership_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.membership_plans
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donations
CREATE POLICY "Admins can view all donations" ON public.donations
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create donations" ON public.donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update donations" ON public.donations
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for members
CREATE POLICY "Members can view own data" ON public.members
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can update own data" ON public.members
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all members" ON public.members
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage members" ON public.members
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create member profile" ON public.members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Members can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.id = subscriptions.member_id 
            AND members.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.id = subscriptions.member_id 
            AND members.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.id = subscriptions.member_id 
            AND members.user_id = auth.uid()
        )
    );

-- RLS Policies for payments
CREATE POLICY "Members can view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.members 
            WHERE members.id = payments.member_id 
            AND members.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert payments" ON public.payments
    FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_membership_plans_updated_at
    BEFORE UPDATE ON public.membership_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Generate payment reference function
CREATE OR REPLACE FUNCTION public.generate_payment_reference()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    ref TEXT;
BEGIN
    ref := 'PAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));
    RETURN ref;
END;
$$;

-- Insert default membership plans
INSERT INTO public.membership_plans (name, description, type, price, features) VALUES
('Monthly Membership', 'Support us every month with automatic payments', 'monthly', 500.00, '["Monthly newsletter", "Event updates", "Member badge"]'::jsonb),
('Yearly Membership', 'Annual membership with savings', 'yearly', 5000.00, '["Monthly newsletter", "Event updates", "Member badge", "Priority event access", "Annual report"]'::jsonb),
('Lifetime Membership', 'One-time payment for lifetime access', 'lifetime', 25000.00, '["All yearly benefits", "Lifetime recognition", "VIP event access", "Founding member status"]'::jsonb);