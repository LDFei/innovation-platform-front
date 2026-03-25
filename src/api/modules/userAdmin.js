/**
 * 用户管理相关 API（管理员功能）
 */
import { get, post, put, del, handleResponse } from '../request'

/**
 * 获取用户列表
 * @param {object} params - 查询参数
 */
export function getUserList(params = {}) {
  return handleResponse(get('/users', params))
}

/**
 * 获取用户详情
 * @param {number|string} id - 用户 ID
 */
export function getUserById(id) {
  return handleResponse(get(`/users/${id}`))
}

/**
 * 管理员创建用户
 * @param {object} data - 用户数据
 */
export function createUser(data) {
  return handleResponse(post('/users', data))
}

/**
 * 更新用户信息
 * @param {number|string} id - 用户 ID
 * @param {object} data - 更新的用户数据
 */
export function updateUser(id, data) {
  return handleResponse(put(`/users/${id}`, data))
}

/**
 * 更新用户状态
 * @param {number|string} id - 用户 ID
 * @param {number} status - 状态：0-禁用，1-启用
 */
export function updateUserStatus(id, status) {
  return handleResponse(put(`/users/${id}/status`, { status }))
}

/**
 * 重置用户密码
 * @param {number|string} id - 用户 ID
 * @param {string} newPassword - 新密码
 */
export function resetPassword(id, newPassword) {
  return handleResponse(put(`/users/${id}/password/reset`, { newPassword }))
}

/**
 * 删除用户
 * @param {number|string} id - 用户 ID
 */
export function deleteUser(id) {
  return handleResponse(del(`/users/${id}`))
}
