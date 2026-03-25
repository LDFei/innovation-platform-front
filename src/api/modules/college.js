/**
 * 学院相关 API
 */
import { get, handleResponse } from '../request'

/**
 * 获取所有学院列表
 */
export function getAllColleges() {
  return handleResponse(get('/colleges'))
}
