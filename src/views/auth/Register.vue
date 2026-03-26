<template>
  <div class="register-container">
    <div class="register-background">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
      <div class="bg-grid"></div>
    </div>
    
    <div class="register-content">
      <div class="register-card">
        <div class="card-header">
          <h1 class="card-title">创新创业服务系统</h1>
          <h2>用户注册</h2>
          <p>请填写以下信息完成注册</p>
        </div>
        
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  size="large"
                  :prefix-icon="User"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码（至少6位，包含字母和数字）"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input
                  v-model="registerForm.realName"
                  placeholder="请输入真实姓名"
                  size="large"
                  :prefix-icon="UserFilled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属学院" prop="collegeId">
                <el-select
                  v-model="registerForm.collegeId"
                  placeholder="请选择所属学院"
                  size="large"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="college in collegeList"
                    :key="college.id"
                    :label="college.name"
                    :value="college.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="registerForm.email"
                  placeholder="请输入邮箱"
                  size="large"
                  :prefix-icon="Message"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="registerForm.phone"
                  placeholder="请输入手机号"
                  size="large"
                  :prefix-icon="Phone"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-alert
              title="注册须知"
              description="本平台仅限学生自主注册，教师及管理员账号请联系学院管理员或学校管理员创建。"
              type="info"
              :closable="false"
              show-icon
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="register-btn"
              @click="handleRegister"
            >
              <span v-if="!loading">注 册</span>
              <span v-else>注册中...</span>
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span>已有账号？</span>
            <el-link type="primary" @click="goToLogin">立即登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, UserFilled, Message, Phone } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getAllColleges } from '@/api/modules/college'

const router = useRouter()
const userStore = useUserStore()

const registerFormRef = ref(null)
const loading = ref(false)
const collegeList = ref([])

const registerForm = reactive({
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  role: 'STUDENT',
  collegeId: null
})

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { 
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, 
      message: '密码至少6位，包含字母和数字', 
      trigger: 'blur' 
    }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  collegeId: [
    { required: true, message: '请选择所属学院', trigger: 'change' }
  ]
}

// 获取学院列表
const fetchColleges = async () => {
  try {
    const data = await getAllColleges()
    collegeList.value = data || []
  } catch (error) {
    ElMessage.error('获取学院列表失败')
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.register(registerForm)
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  fetchColleges()
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.bg-shape-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.bg-shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

.bg-shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 20px) scale(0.95);
  }
  75% {
    transform: translate(-20px, -10px) scale(1.02);
  }
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.register-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 700px;
  min-height: auto;
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px);
}

.register-card {
  width: 100%;
  padding: 48px 40px;
}

.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 24px 0;
  letter-spacing: 0.5px;
}

.card-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.register-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  padding-bottom: 8px;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid #e8e8e8;
  padding: 4px 15px;
  transition: all 0.3s ease;
}

.register-form :deep(.el-input__wrapper:hover) {
  border-color: #1890ff;
}

.register-form :deep(.el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.15);
}

.register-form :deep(.el-input__inner) {
  height: 44px;
  font-size: 15px;
}

.register-form :deep(.el-input__prefix-inner) {
  color: #999;
}

.register-form :deep(.el-select .el-input__wrapper) {
  border-radius: 12px;
}

.register-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  margin-top: 16px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 144, 255, 0.4);
}

.register-btn:active {
  transform: translateY(0);
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.form-footer .el-link {
  font-weight: 500;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .register-content {
    width: 94%;
    padding: 24px 0;
  }
  
  .register-card {
    padding: 32px 20px;
  }
  
  .el-col {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }
}
</style>
