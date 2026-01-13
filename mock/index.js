/**
 * @author xwz
 * @description Mock 入口文件（Vite 版本）
 */
import user from './controller/user'
import router from './controller/router'
import table from './controller/table'
import tree from './controller/tree'
import icon from './controller/icon'

export default [...user, ...router, ...table, ...tree, ...icon]
