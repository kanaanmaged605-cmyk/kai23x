import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

const AuthPage = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, displayName);

    if (result.error) {
      setError(result.error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-foreground">متجري</h1>
          <p className="text-muted-foreground text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isLogin ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                !isLogin ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">الاسم</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="أدخل اسمك"
                  required={!isLogin}
                  className="bg-secondary/50 border-border"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="bg-secondary/50 border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary/50 border-border"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                <LogIn className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            أول مستخدم يسجل سيحصل على صلاحية Admin تلقائياً
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
