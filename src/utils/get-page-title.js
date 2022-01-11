import defaultSettings from '@/settings'

const title = defaultSettings.title || '先锋音讯云管理平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
