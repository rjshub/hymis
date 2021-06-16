import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const zh = {
    lang: {
        overall_language: 'chinese', // 特殊定义，便于复杂文本编写
        // login登录页文本
        login_system_value: '<p style="font-size: 52px;"><span style="color:#42A996">大数据引擎 </span><span>助力品牌主抢占<br />媒介资源先机</span></p>',  //login页面文字展示
        login_system_apply: '集洞察、分析、执行、监控为一体的智慧媒介决策平台<br />量身定制全营销链服务',  //login页面文字展示
        login_form_title: '用户登录',   // 登录表单标题
        login_button_text: '登 录',   // 登录表单按钮文字
        login_button_text_ing: '正在登录',   // 登录表单按钮文字
        login_username_placeholder: '请输入用户名',  // 输入框占位文本
        login_password_placeholder: '请输入密码',  // 输入框占位文本
        login_vcode_placeholder: '请输入验证码',   // 输入框占位文本
        login_vcode_refresh: '点击刷新验证码',   // 验证码tooltip提示
        login_username_require: '请输入用户名',  // 用户名校验
        login_username_rule: '长度在 2 到 20 个字符',
        login_password_require: '请输入密码',  // 密码校验
        login_password_rule: '长度在 8 到 20 个字符',
        login_vcode_require: '请输入验证码',   // 验证码校验
        login_vcode_rule: '长度为 4 个字符',
        // layout文本
        layout_info_title: '个人信息',  // 用户个人中心
        layout_logout: '退出系统',
        layout_skin: '主题',
        layout_skin_dark: '深色系',
        layout_skin_light: '浅色系',
        layout_help_title: '帮助中心',
        layout_help_tooltip: '点击下载系统操作手册',  // 帮助中心icon-tooltip提示
        layout_agent_placeholder: '请选择所属代理',   // 代理选择下拉框占位文本
        // 一级导航
        first_nav_allocation_strategy: '分配策略',
        first_nav_media_strategy: '媒介策略',
        first_nav_system_management: '系统管理',
        // 二级导航
        secondary_nav_OTV_OTT: 'OTV/OTT分量',
        secondary_nav_display: 'Display预算分配',
        secondary_nav_medium_recommendation: '媒介推荐',
        secondary_nav_roles_manage: '角色管理',
        secondary_nav_users_manage: '用户管理',
        secondary_nav_clients_manage: '客户管理',
        secondary_nav_OTV_OTT_rules_manage: 'OTV/OTT规则管理',
        secondary_nav_medium_manage: '媒体管理',
        secondary_nav_operation_log: '操作日志',
        // 三级导航
        third_nav_project_list: '项目列表',
        third_nav_archived_project: '归档项目',
        third_nav_add_project: '新建项目',
        third_nav_budget_list: 'Display预算分配',
        third_nav_add_budget: '新增预算分配',
        third_nav_media_ranking: '媒体综合排名',
        third_nav_position_ranking: '点位综合排名',
        third_nav_device_coverage_ranking: '媒体覆盖排名',
        third_nav_media_overlap_ranking: '媒体重合度',
        // 面包屑导航（媒体管理特殊，有点长，单独定义）
        media_breadcrumb: 'HY.PBS媒介推荐',
        // 通用组件文本(下拉，输入框)
        public_client_placeholder: '请选择客户',  // 客户下拉筛选
        public_client_label: '客户',
        public_client_All: '全部客户',
        public_brand_placeholder: '请选择品牌',  // 品牌下拉筛选
        public_brand_label: '品牌',
        public_brand_All: '全部品牌',
        public_product_placeholder: '请选择产品',  // 产品下拉筛选
        public_product_label: '产品',
        public_product_All: '全部产品',
        public_port_placeholder: '请选择端口',  // 端口下拉筛选
        public_port_label: '端口',
        public_port_All: '全部端口',
        public_project_placeholder: '请选择项目',  // 项目下拉筛选
        public_project_label: '项目',
        public_project_All: '全部项目',
        public_status_placeholder: '请选择状态',  // 状态下拉筛选
        public_status_label: '状态',
        public_status_All: '全部状态',
        public_DatePicker_start: '开始日期',  // 时间选择器
        public_DatePicker_between: '至',
        public_DatePicker_end: '结束日期',
        public_key_words: '关键字搜索',  // 关键字搜索提示
        public_input_client_placeholder: '请输入客户名称', 
        public_industry_placeholder: '请选择行业',
        public_industry_label: '行业',
        public_industry_All: '全部行业',
        public_project_period_placeholder: '请选择项目周期',
        public_period_label: '周期',
        public_audience_placeholder: '请选择人群性别',
        public_audience_label: '人群',
        public_target_audience_label: '目标人群',
        public_version_placeholder: '请选择版本',
        public_version_label: '版本号',
        public_current_version_label: '当前版本',
        public_submit_data_label: '提交数据',  // 提交数据，非提交
        public_project_name_placeholder: '请输入名称', // 名称name
        public_project_name: '名称', // 名称name
        public_add_one_more: '继续添加',
        public_enter_placeholder: '请输入',
        public_media_placeholder: '请选择媒体',
        public_media_label: '媒体',
        public_media_type_placeholder: '请选择媒体类型',
        public_media_type_label: '媒体类型',
        public_city_placeholder: '请选择城市',
        public_enter_adName_placeholder: '请输入广告名称',
        public_period_placeholder: '请选择周期',
        public_budget_placeholder: '请输入项目预算',
        public_budget_label: '预算',
        public_target_placeholder: '请选择目标',
        public_target_label: '目标',
        public_age_gender_placeholder: '请选择性别和年龄',
        public_age_placeholder: '请选择年龄',
        public_Goal_label: '目标函数',
        public_Goal_placeholder: '请选择目标函数',
        public_all_Target: '全部目标函数',
        public_maximum_placeholder: '上限',
        public_minimum_placeholder: '下限',
        public_position_placeholder: '请选择点位',
        public_Media_primary_classification_placeholder: '媒体一级分类',
        public_Media_second_classification_placeholder: '媒体二级分类',
        public_MediaA_placeholder: '媒体A',
        public_MediaB_placeholder: '媒体B',
        public_role_level_placeholder: '请选择角色级别',
        public_all_level_label: '全部级别',
        public_level1_label: '一级',
        public_level2_label: '二级',
        public_all_agent: '全部代理',
        public_role_name: '角色名称',
        public_role_name_placeholder: '请输入角色名称',
        public_role_level_label: '角色级别',
        public_agent_name_placeholder: '请输入所属代理名称',
        public_phone_placeholder: '请输入手机号码',
        public_email_placeholder: '请输入电子邮箱',
        public_enter_password_placeholder: '请输入用户密码',
        public_enter_password_again_placeholder: '请再次输入用户密码',
        public_confirm_password_error: '两次输入密码不一致!', //Request failed.Two passwords do not match.
        public_enter_user_name_placeholder: '请输入用户名称',
        public_enter_true_name_placeholder: '请输入用户姓名',
        public_select_role_placeholder: '请选择用户角色',
        public_shortName_placeholder: '请输入简称',
        public_shortName_label: '简称',
        public_chinese_name_placeholder: '请输入中文名称',
        public_english_name_placeholder: '请输入英文名称',
        public_media_name_placeholder: '请输入媒体名称',
        public_MIS_media_name: '请输入MIS媒体名称',
        public_pbs_media_search: 'PBS媒体ID/名称,可多选,支持模糊搜索查找',
        public_select_primary_classification_placeholder: '请选择媒体一级分类',
        public_select_second_classification_placeholder: '请选择媒体二级分类',
        public_select_Bid_type_placeholder: '请选择竞价类型',
        public_Bid_type_label: '竞价类型',
        public_algorithmSupport_placeholder: '请选择算法支持',
        public_MIS_position_name_placeholder: '请输入MIS点位名称',
        public_position_name_placeholder: '请输入点位名称',
        public_select_MIS_media_placeholder: '请选择所属MIS媒体',
        public_select_selling_unit_placeholder: '请选择售卖单位',
        public_select_related_pbs_id_placeholder: '请选择关联PBS ID',
        // 多为组件使用
        public_empty_list_text: '暂无数据',  // 列表无数据匹配
        public_no_update_text: '暂无更新', 
        public_fold: '收起',  // 收起
        public_unfold: '展开',  // 展开
        public_load_more: '加载更多',  // 加载更多
        public_loading: '正在加载中...',
        public_close: '关闭',
        public_gender: '性别',
        public_male: '男',
        public_female: '女',
        public_all: '全部',
        public_age: '年龄',
        public_example: '示例',
        public_operation_manual: '操作指南',
        public_add: '新增', // 新增
        public_upload: '上传',
        public_upload_picture: '上传图片',
        public_uploading: '上传中',
        public_uploaded: '上传完成',
        public_upload_success: '上传成功！',
        public_upload_again: '重传',
        public_upload_again_success: '重传成功！',
        public_select_file: '选择文件',
        public_upload_fail: '上传失败，请稍后重试!',
        public_upload_condition: '允许上传格式为jpg/png的正方形图片，不超过50KB',
        public_operate: '操作',
        public_type: '类型',
        public_other: '其他', 
        public_edit_success: '编辑成功',
        public_delete_success: '删除成功',
        public_add_success: '添加成功',
        public_required: '不能为空',
        public_delete_confirm: '您确定要删除该',
        public_unable_to: '无法进行',
        public_The_server_is_processing: '服务器正在处理中...',
        public_preview: '预览区',
        public_back: '返回上一步',
        public_Start_calculating: '开始计算',
        public_view_last_result: '查看上次结果',
        public_Again_calculating: '重新计算',
        public_number_unit: '个',
        public_under_19: '19岁以下',
        public_over_50: '50岁以上',
        public_selected: '已选',
        public_Readable: '可读',
        public_Writable: '可写',
        public_request_fail: '数据获取失败',
        public_support: '支持',
        public_not_support: '不支持',
        public_day: '天',
        public_checkAll: '全选',
        public_handle_empty: '清空',//清空
        public_start: '开始使用',
        // 共用表头（可能）
        public_table_monthly_unique_devices_zh: '月覆盖设备数（万）',
        public_table_monthly_unique_devices_en: '月覆盖设备数(万)',
        // tooltip或其他共用
        public_tooltip_draft: '草稿',  // 草稿
        public_tooltip_finish: '完成',  // 完成
        public_tooltip_detail: '详情',  // 详情
        public_tooltip_edit: '编辑',  // 编辑
        public_tooltip_show: '查看',  // 查看
        public_tooltip_download: '下载',  // 下载
        public_tooltip_history: '历史',  // 历史
        public_tooltip_archives: '归档',  // 归档
        public_tooltip_delete: '删除',  // 删除
        public_tooltip_activating: '激活',  // 激活
        public_tooltip_more: '更多', // 更多
        public_tooltip_base: '基数', // 基数
        public_tooltip_ranking: '排名', // 排名
        public_tooltip_total_score: '总分', // 总分
        public_tooltip_scored: '权重后', // 权重后
        public_tooltip_ascending_order: '正序计算', // 正序计算
        public_tooltip_descending_order: '倒序计算', // 倒序计算
        public_tooltip_add: '添加', // 添加
        public_tooltip_error: '错误', // 错误
        public_tooltip_on: '启用',
        public_tooltip_off: '禁用',
        public_tooltip_permission: '权限',
        public_tooltip_first: '置顶',
        public_tooltip_arrow_top: '向上',
        public_tooltip_arrow_down: '向下',
        public_tooltip_last: '置底',
        public_tooltip_sort: '序号',
        public_tooltip_create: '新建',
        public_tooltip_back_to_top: '回到顶部',
    
        public_button_confirm: '确定', // 中文确认按钮
        public_button_save: '保存', // 中文保存按钮
        public_button_submit: '提交', // 中文提交按钮
        public_button_continue: '继续', // 中文继续按钮
        public_button_cancel: '取消', // 中文取消按钮
        public_dialog_point: '提示',  // 确认弹框提示文字
        public_dialog_warning: '警告',  // 确认弹框警告文字

        // layout文本配置
        layout_logout_confirm: '确认要退出系统吗？如有仍未保存的编辑内容会被舍弃?',
        layout_download_operation_manual: '您是否需要下载HYMIS操作手册？',
    
        // 分配策略-项目管理列表 Allocation Strategy => AS
        AS_no_client_point1: '您还没创建客户，请前往【系统管理】>【',  // 项目列表未创建客户信息提示
        AS_no_client_point2: '】创建',  // 项目列表未创建客户信息提示
        AS_no_client_tooltip: '点击跳转新建客户',  // 项目列表未创建客户信息提示
        AS_no_project_point1: '您还没创建过项目，请点击【',  // 项目列表未创建任何一条项目数据
        AS_no_project_point2: '】添加',  // 项目列表未创建任何一条项目数据
        AS_no_project_tooltip: '点击跳转新增项目',  // 项目列表未创建任何一条项目数据
        AS_no_archived_project: '目前您还没有已归档的项目',   // 没有归档项目
        AS_no_project_list_permission: '暂无项目列表权限',  // 没有项目列表权限
        AS_no_create_client_permission: '您暂无创建客户的权限,请联系您的管理员创建。',
        AS_no_create_project_permission: '您暂无新增项目的权限,请联系您的管理员开通权限。',
        AS_project_detail: '项目详情', // 项目详情弹框title

        // 分配策略->项目详情
        AS_detail_project_info_title: '项目信息', // 基本信息弹框title
        AS_detail_years_old: '岁',  // 岁
        AS_detail_target_CPM: '目标CPM',
        AS_detail_allocation: '分量',
        AS_detail_basic_info_helpTitle: '可新建或修改已创建的项目基本信息，包含：项目名称、Campaign周期、客户、品牌、产品、端口、目标人群。',  // basic info帮助提示
        AS_detail_basic_info_money_unit: '元',  // basic info人民币单位
        AS_detail_basic_data_helpTitle: 'Basic Data 目标CPM Reach Goal上传表格规范说明',  // basic data帮助提示
        AS_detail_basic_data_media_label: '全部Media',
        AS_detail_basic_data_market_label: '全部Market',
        AS_detail_basic_data_create_form: {
            media_inventory: '媒体库存CPM',
            inventory_discount: '库存折扣',
            CPM_unit_cost_for_client: '客户版CPM价格',
            CPM_nit_cost_for_media: '媒体版CPM价格',
            target_CPM: '目标CPM'
        },
        AS_detail_basic_data_delete_confirm: '您确定要删除此行吗?',
        AS_detail_basic_data_example_title: 'Basic Data 表格规范',
        AS_detail_basic_data_example_basic_data: {
            describe: 'Basic Data 为分量做基础数据支持，包含目标投放市场、媒体、CPM价格、媒体库存等基本信息',
            format1: '①表格命名规则：BD_项目编号_项目名称.xlsx 例：BD_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②Media&Market：使用中文填写，需与其他表格表达一致，同时',
            format3: '命名按规则填写（点击可下载城市媒体规则列表，excel格式）',
            format4: '③库存折扣：填写0-1间的数字，如"0.500"或‘0.5’，即表示库存打5折。此处库存折扣将作为分量计算时的上限使用。数值保留至小数点后四位',
            format5: '④客户版CPM价格 & 媒体版CPM价格：填写数字，有效范围>0，数值保留至小数点后四位'
        },
        AS_detail_basic_data_example_target_cpm: {
            describe: '目标CPM为目标投放市场广告效果指标',
            format1: '①表格命名规则：TC_项目编号_项目名称.xlsx，例TC_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②Market：使用中文填写，需与其他表格表达一致，同时',
            format3: '命名按规则填写（点击可下载城市规则列表，excel格式）',
            format4: '③目标CPMl列：填写阿拉伯数字有效范围>0，且为整数形式',
            format5: '④此表格上传内容不可为空列，否则上传失败'
        },
        AS_detail_basic_data_example_reach_goal: {
            describe: 'Reach Goal为目标投放市场广告效果投放指标',
            format1: '①表格命名规则：RG_项目编号_项目名称.xlsx  例：RG_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②Market：使用中文填写，需与其他表格表达一致，同时',
            format3: '命名按规则填写（点击可下载城市规则列表，excel格式）',
            format4: '③Reach goal列',
            format5: 'a.  frequency，填写阿拉伯数字，有效范围>0',
            format6: 'b.  reach，填写百分比形式，有效范围：0~100%，如"35%"',
            format7: '④此表格上传内容不可为空列，否则上传失败'
        },
        AS_detail_basic_data_reach_to_cpm: '是否确认切换【目标CPM】，【Reach Goal】数据将被清空',
        AS_detail_basic_data_cpm_to_reach: '是否确认切换【Reach Goal】，【目标CPM】数据将被清空',
        AS_detail_basic_data_before_handle: '请先完成您的数据编辑，然后再进行',
        AS_detail_basic_data_before_delete: '请先完成您的数据编辑，然后进行删除操作',
        AS_detail_basic_data_upload_check: '您上传了新数据,请点击【提交】按钮确认',
        AS_detail_basic_data_preview_config: {
            reach_goal: '媒体库存',
            customer_cpm: '客户版CPM价格'
        },
        AS_detail_score_card_guaranteed_base: '保底基数',
        AS_detail_score_card_delete_column: '您确定要删除此列数据吗',
        AS_detail_score_card_example_title: 'Score Card 表格规范',
        AS_detail_score_card_helpTitle: 'Score Card上传表格规范说明',
        AS_detail_score_card_example_score_card: {
            describe: 'Score Card为媒体打分表，得分越高的媒体排名越高；由各媒体不同维度指标、指标权重及复合计算排序完成',
            format1: '①表格命名规则：SC_项目编号_项目名称.xlsx 例：SC_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②权重：填写百分比形式，有效范围：0-100%，所填写项相加总共为100%',
            format3: '③Media&#38;Market：使用中文填写，需与其他表格一致，',
            format4: '同时market&media命名按规则填写',
            format5: '④指数列（月覆盖设备数（万）、TGI、CPM、Performance等）：填写数字，数值允许保留至小数点后四位',
            format6: '⑤权重下方为计算方式：1 代表数值越大得分越高， -1 代表数值越小得分越高',
            format7: '⑥Overlapping：如需要使用overlapping维度，则需上传Overlapping Data数据，系统进行复合计算',
        },
        AS_detail_score_card_example_over_lapping: {
            describe: 'Overlapping Data为媒体打分辅助表，可协助“月覆盖设备数”指数进行复合指数计算，得出复合排名',
            format1: '①表格命名规则：OL_项目编号_项目名称.xlsx 例：OL_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②Media&#38;Market：使用中文填写，需与其他表格一致，',
            format3: '同时market&media命名按规则填写',
            format4: '③媒体重合度%：填写百分比形式，有效范围0-100%，数值允许保留至小数点后四位',
        },
        AS_detail_score_card_editing: '存在正在编辑的数据,',
        AS_detail_score_card_adding: '存在正在新建的数据,',
        AS_detail_score_card_finish_editing: '请先完成编辑',
        AS_detail_score_card_finish_adding: '请先完成新建',
        AS_detail_score_card_unable_to_filter: '不可使用过滤',
        AS_detail_reach_curve_helpTitle: 'Reach Curve上传表格规范说明',
        AS_detail_reach_curve_example_title: 'Reach Curve 表格规范',
        AS_detail_reach_curve_example: {
            describe: 'Reach Curve来源于秒针提供数据，系统根据Basic Data上传的Market&Reach Goal对应此表定位目标IMP',
            format1: '①表格命名规则：RC_项目编号_项目名称.xlsx 例：RC_01-1-1-1_雪佛兰XXX推广.xlsx',
            format2: '②Reach Curve 表包含多张sheet(由campaign城市数量决定)',
            format3: '③sheet名称使用Market名称，统一用中文，',
            format4: 'Market命名必须按指定规则填写',
            format5: '，且与Basic Data中一致',
            format6: '④此表样式和字段需与“表格样例”图一致',
        },
        AS_detail_component_compute_new_version: '已生成项目新版本',
        AS_detail_component_compute_title: '分量计算',
        AS_detail_component_compute_helpTitle: '系统分量初始计算表，可查看初始分量结果，并选择调整媒体‘库存折扣’或‘目标Cost%’，生成系统分量调整计算表',
        AS_detail_component_compute_table: {
            target_CPM: '目标CPM',
            media_inventory: '媒体库存CPM',
            inventory_discount: '库存折扣',
            calculated_inventory: '计算库存',
            Round_off_number: '分量取整',
            GAP_title: '目标与实际分量CPM差异(GAP)',
            CPM_nit_cost_for_media: '媒体CPM价格',
            total_cost_for_media: '媒体版总价格',
            CPM_unit_cost_for_client: '客户CPM价格',
            total_cost_for_client: '客户版总价格',
            target_cost: '目标cost%'
        }, 
        AS_detail_component_compute_Target_cost_setting: '进入目标COST设置',
        AS_detail_component_compute_COST_Goal_Settings: '目标COST%调整表',
        AS_detail_component_compute_Minimum_inventory_discount: '库存折扣最小值',
        AS_detail_component_compute_upload_target_cost: '上传目标cost%',
        AS_detail_component_compute_Calculation: '进行分量计算',
        AS_detail_component_compute_cannot_cost_setting: '不能进行目标COST设置，请先删除结果表后，可以重新进行设置',
        AS_detail_component_compute_inventory_discount_tooHigh: '分量无解，库存折扣最小值设置过高，请尝试调低重新求解',
        AS_detail_component_compute_fine_tune_cost: '分量无解，请微调目标cost%设置，重新求解',
        AS_detail_component_compute_cannot_to_filter: '请先完成库存折扣的编辑再进行过滤筛选',
        AS_detail_component_compute_finish_ID_modification_first: '请先完成您的库存折扣修改',
        AS_detail_component_compute_new_budget_result: '此项目已生成新版分配结果',
        AS_detail_component_table_title: '分量表', 
        AS_detail_component_table_title_compute: '分量计算表', //Budget Allocation
        AS_detail_component_table_helpTitle: '系统根据Step4生成最终媒体分量表，可切换查看初始或调整分量表，可下载分量表excel格式文件',
        AS_detail_component_table_config: {
            cpm_differ: 'GAP',
            GAP_title: '目标与实际分量CPM差异(GAP)',
            reach_goal: 'Reach Goal',
            real_reach: '实际Reach',
            goal_cpm: '目标CPM',
            real_cpm: '实际分量CPM',
        },
        AS_detail_component_table_preview_config: {
            real_reach: '实际Reach',
            goal_cpm: '目标CPM',
            real_cpm: '实际分量', //Actual Allocation
            customer_total_cost: '客户版total Cost'
        },
        AS_detail_schedule_table_title: '排期表',
        AS_detail_schedule_table_helpTitle: '系统根据输入条件生成最终媒体排期表，可下载排期表excel格式文件',
        AS_detail_schedule_table_config: {
            web_site: '网站位置',
            ad_name: '广告名称',
            unit_quantity: '单位数量',
            unit: '单位',
            start_day: '点位开始时间',
            end_day: '点位结束时间',
        },
        AS_detail_schedule_table_delete_confirm: '您确定要删除该排期表吗?',
        AS_detail_schedule_table_edit_form: {
            ad_name: '广告名称',
            period_Proportion: '周期及占比',
            percent: '占比',
        },
        AS_detail_schedule_table_delete_setting_confirm: '您确定要删除该条高级设置吗?',
        AS_detail_schedule_table_preview_config: {
            web_site: '网站位置',
            unit_quantity: '单位数量',
            start_day: '点位开始',
            end_day: '点位结束',
        },
        AS_detail_schedule_table_Advanced_settings_error: '注：高级设置非必填项，若进行设置，则此部分将从通用设置中剔除做特殊处理',
        AS_detail_schedule_table_Advanced_settings_ranking_number: '高级设置的第',

        // 项目详情通用文本
        AS_detail_sample_table: '表格样例：',
        AS_detail_specification: '规范说明：',
        AS_detail_download_form_template: '下载源模板',
        AS_detail_result: '结果',
        AS_detail_initial_value: '初始',
        AS_detail_download_excel: '导出excel',
        AS_detail_proportion: '比重',
        AS_detail_media: '媒体版',
        AS_detail_client: '客户版',
        AS_detail_Spotplan_setting: '排期设置',
        AS_detail_back_step4: '返回step4',
        AS_detail_common_setting: '通用设置',
        AS_detail_advanced_setting: '高级设置',

        // 预算分配
        budget_ta_percent: 'TA占比',
        budget_no_permission: '暂无预算分配权限',
        budget_step1_title: '项目基本信息配置',
        budget_Maximum_target: '请输入最高目标值',
        budget_Minimum_target: '请输入最低目标值',
        budget_coverage_label: '覆盖数',
        budget_exposures_label: '曝光数',
        budget_step2_title: '媒体&点位', //Please choose medium and positions
        budget_upload_position_table: '上传对应的点位信息表',
        budget_download_position_format_table: '点位信息format下载',
        budget_Start_Period_protection: '开启周期保护',
        budget_step3_title: '预算分配结果',
        budget_step3_result_table_config: {
            media_type: '媒体类型',
            media: '媒体',
            position: '点位',
            uv: '预估覆盖',
            ta: 'TA%',
            win: '预估曝光',
            price: '分配预算',
            days: '购买天数',
        },
        budget_step4_title: 'KPI预估', //KPI estimation
        budget_step4_kpi_table_config: {
            media_type: '媒体类型',
            media: '媒体',
            CPM: '预估CPM',
            CPC: '预估CPC',
            CPL: '预估CPL',
            CTR: '预估CTR',
            CPUV: '预估CPUV',
        },
        budget_Calculate_fail: '无解，请调整配置条件后重试',
        budget_port_change_fail: '您选择的端口中包含PC/WAP,不支持TA目标人群函数',

        // 媒介策略  Media Strategy
        MS_Strategy_management: '策略管理',
        MS_title: '以下数据均以华扬DSP真实投放数据为依据',
        MS_uv: '月独立设备数(万台)',
        MS_uv_tooltip: '按月度展示的媒体独立设备覆盖数据',
        MS_uv_no_unit: '月独立设备数',
        MS_devices: '设备数(万台)',
        MS_10K: '万台',
        MS_10K_: '(万台)',
        MS_area: '地区',
        MS_date_picker_format: 'yyyy 年 MM 月',
        // 媒体重合表
        MS_Media_coincide_table_config: {
            id: '序号',
            media: '媒体名称',
            mediaOneLevel: '媒体一级分类',
            mediaTwoLevel: '媒体二级分类',
            uv: '月独立设备数(万台)',
            union_uv: 'AUB不重复设备数(万台)',
            intersection_uv: 'AnB共同设备数(万台)',
            overlap_rate: '重合度',
        },
        // 媒体覆盖排名表
        MS_media_cover_rank_table_config: {
            rank: '排名',
            media: '媒体名称',
            level_1_name: '媒体一级分类',
            level_2_name: '媒体二级分类',
            uv: '月独立设备 (万台)',
            uv_title: '按月度展示的媒体独立设备覆盖数据',
        },
        MS_media_cover_rank_Age_composition: '人群年龄占比',
        MS_media_cover_rank_user_total: '用户总数',
        MS_media_cover_rank_Geographical_distribution: '使用地域占比',
        MS_media_cover_rank_all_area: '全区',
        MS_media_cover_rank_Gender_composition: '人群性别占比',
        // 媒体综合排名表
        MS_media_cph_rank_table_config: {
            rank: '排名',
            media: '媒体名称',
            level_1_name: '媒体一级分类',
            level_2_name: '媒体二级分类',
            score: '综合评分',
            score_tooltip: '媒体覆盖数、以及历史投放数据综合效果打分',
            increase: '环比增幅',
            increase_tooltip: '媒体选中月与前一个月环比增长比率'
        },
        // 媒体综合排名表
        MS_point_cph_rank_table_config: {
            rank: '排名',
            pos_name: '点位名称',
            media: '媒体名称',
            level_1_name: '媒体一级分类',
            level_2_name: '媒体二级分类',
            ports: '终端类型',
            score: '综合评分',
            increase: '环比增幅',
        },

        // 系统管理
        // 角色管理
        system_add_new_role: '新增角色',
        system_role_permission: '权限',
        system_role_table_config: {
            role_name: '角色名称',
            agent_level_name: '角色级别',
            agent_name: '所属代理',
            ctime: '创建时间',
            utime: '更新时间',
            status: '状态',
            status_en: '启用',
            status_un: '停用',
            operate: '操作'
        },
        system_role_no_user_delete_confirm: '您确定要删除该角色吗?',
        system_role_users_delete_confirm: '您是否确认要删除此角色，关联用户权限会被清空',
        system_role_switch_level_confirm: '切换角色级别，会导致已设置的数据丢失，是否继续?',
        system_role_delete_fail: '删除角色失败，请稍后重试',
        system_role_add_title: '新建角色',
        system_role_edit_title: '编辑角色',
        system_role_Permissions_configuration: '权限配置',
        system_role_Generate_Permissions: '生成权限',
        system_role_client_permission: '客户权限',
        system_role_delete_permission_confirm: '您确定要删除该权限吗?',
        system_role_Client_permissions_empty: '如下权限项-客户权限为空',
        system_role_Section_permissions_empty: '如下权限项-板块权限为空',
        system_role_permissions_empty: '如下权限对应的权限列表为空',
        system_role_continue_submit_confirm: '您确定继续提交吗？',
        system_role_all_section: '全部板块',
        system_role_section_permission: '板块权限',
        // 用户管理
        system_user_add: '新增用户',
        system_user_table_config: {
            username: '用户名称',
            agent_level_name: '角色级别',
            agent_name: '所属代理',
            role_name: '角色名称',
            ctime: '创建时间',
            utime: '更新时间',
            status: '状态',
            status_en: '启用',
            status_un: '停用',
            operate: '操作'
        },
        system_user_detail_title: '用户详情',
        system_user_name_label: '用户名称',
        system_user_role_name_label: '所属角色',
        system_user_true_name_label: '用户姓名',
        system_user_phone_label: '手机号码',
        system_user_email_label: '电子邮箱',
        system_user_account_status_label: '账号状态',
        system_user_last_login_label: '最近登录',
        system_user_add_title: '新建用户',
        system_user_edit_title: '编辑用户',
        system_user_form_config: {
            username: '用户名称',
            role_id: '用户角色',
            password: '用户密码',
            password_again: '确认密码',
            truename: '用户姓名',
            phone: '手机号码',
            email: '电子邮箱',
        },
        system_user_not_change_password: '不修改密码请跳过此项',
        // 客户管理
        system_client_add_title: '新建客户',
        system_client_add_new_brand: '新增品牌',
        system_client_delete_client_confirm1: '您确定要删除该客户（',
        system_client_delete_client_confirm2: '）吗?',
        system_client_add_new_product: '新增产品',
        system_client_delete_brand_confirm1: '您确定要删除该品牌（',
        system_client_delete_brand_confirm2: '）吗?',
        system_client_delete_product_confirm1: '您确定要删除该产品（',
        system_client_delete_product_confirm2: '）吗?',
        system_client_get_image_size_fail: '获取图片尺寸失败',
        // 规则管理
        system_rule_add_city: '新增城市',
        system_rule_add_media: '新增媒体',
        system_rule_city_list: '城市列表',
        system_rule_media_list: '媒体列表',
        system_rule_city_table_config: {
            sort: '序号',
            name: '城市中文名称',
            name_en: '城市英文名称',
            utime: '更新时间',
            status: '状态',
            status_on: '启用',
            status_off: '停用',
            rank: '排序',
            operate: '操作'
        },
        system_rule_city_create_form: {
            name: '中文名称',
            name_en: '英文名称',
        },
        system_rule_city_label: '城市',
        system_rule_media_table_config: {
            sort: '序号',
            name: '媒体名称',
            utime: '更新时间',
            status: '状态',
            status_on: '启用',
            status_off: '停用',
            rank: '排序',
            operate: '操作'
        },
        system_rule_media_create_form: {
            name: '媒体名称'
        },
        system_rule_media_label: '媒体',
        // 媒体管理
        system_media_add_position: '新增点位',
        system_media_position_list: '点位列表',
        system_media_media_table_config: {
            id: 'MIS媒体ID',
            name: '媒体名称',
            pbs_media_name: '关联PBS媒体',
            level_1_name: '媒体一级分类',
            level_2_name: '媒体二级分类',
            position_id: '关联MIS点位ID',
            utime: '更新时间',
            status: '状态',
            status_on: '启用',
            status_off: '停用',
            operate: '操作',
        },
        system_media_pbs_media: '关联MIS点位ID',
        system_media_ids: '如下id：',
        system_media_pbs_not_id: '未在pbs中找到匹配id',
        system_media_media_create_form: {
            id: 'MIS媒体ID',
            misMediaName: 'MIS媒体名称',
            pbsMediaName: 'PBS媒体名称',
            levelOneAss: '媒体一级分类',
            levelTwoAss: '媒体二级分类',
        },
        system_media_point_table_config: {
            id: 'MIS点位ID',
            pos_name: 'MIS点位名称',
            media_name: '所属MIS媒体',
            level_1_name: '媒体一级分类',
            level_2_name: '媒体二级分类',
            pbs_media_names: '关联PBS媒体',
            pbs_pos_id: '关联PBS ID',
            pbs_pos_name: 'PBS点位名称',
            mr: 'PBS点位MR',
            ports: '支持端口',
            bid_type: '竞价类型',
            rate: '刊例价',
            selling_unit: '售卖单位',
            utime: '更新时间',
            status: '状态',
            operate: '操作',
        },
        system_media_point_corresponding_ID: '对应的id如下：',
        system_media_point_cerate_form: {
            misPointName: 'MIS点位名称',
            levelOneAss: '媒体一级分类',
            levelTwoAss: '媒体二级分类',
            misMedia: '所属MIS媒体',
            port: '支持端口',
            bidPrice: '竞价类型',
            rate: '刊例价',
            selling_unit: '售卖单位',
            relationPbsId: '关联PBS ID',
            algorithmSupport: '算法支持',
        },
        system_media_point_support_budget: '支持PDB媒体预算分配',//Budget allocation results of Display media
        system_media_point: '点位',
        system_media_point_clear_related_PBS_ID: '您确定要清空已选的关联PBS ID吗?',
        system_media_point_rate_card_rate: '请输入刊例价',
        // 操作日志
        system_operate_account: '操作账号',
        system_operate_account_placeholder: '操作账号',
        system_operate_role: '操作角色',
        system_operate_role_placeholder: '操作角色',
        system_operate_section: '操作板块',
        system_operate_section_placeholder: '操作板块',
        system_operate_type: '操作类型',
        system_operate_type_placeholder: '操作类型',
        system_operate_table_config: {
            act_time: '操作时间',
            username: '操作账号',
            role_name: '操作角色',
            act_model: '操作板块',
            act_object: '操作对象',
            actionname: '操作类型',
            operate: '变更详情',
            key: '变更项',
            old: '变更前',
            new: '变更后',
        },
        system_operate_fail_get_role_list: '获取角色列表失败，请稍后重试',
        // 用户中心弹框
        system_user_form: {
            username: '用户名称',
            role_id: '用户角色',
            password: '用户密码',
            password_again: '确认密码',
            truename: '用户姓名',
            phone: '手机号码',
            email: '电子邮箱',
        },

        // 正则判断或提示
        reg_required: '不能为空',
        reg_cannot_submit: '不能提交',
        reg_integer_greater_than_0: '(大于0且小于150的整数)',
        reg_integer_must_greater_than_0: '必须是大于0且小于150的整数',
        reg_age_error_msg: '年龄段不可重叠，请重新填写',
        // reg_name_error_msg: '只允许数字、英文、中文、下划线 30个字符以内',
        reg_target_CPM_required: '目标CPM不能为空', //Target CPM is required.
        reg_target_CPM_incorrect: '目标CPM格式不正确，只能是正整数', //Incorrect Target CPM.
        reg_reach_goal_required: 'Reach Goal不能为空', //Reach Goal不能为空
        reg_reach_goal_incorrect: 'Reach Goal格式不正确，例:4+30%"', //Incorrect 'Reach Goal' format. 
        reg_market_required: 'Market不能为空', 
        reg_media_required: 'Media不能为空',
        reg_CPM_unit_cost_for_client_required: '客户版CPM价格不能为空',
        reg_CPM_nit_cost_for_media_required: '媒体版CPM价格不能为空',
        reg_media_inventory_required: '媒体库存(CPM)不能为空',
        reg_inventory_discount_required: '库存折扣不能为空',
        reg_inventory_discount_between: '库存折扣必须在 0到1之间',
        reg_media_cpm_error_msg: '媒体版CPM价格必须为数值，并且整数位最长为12位，小数位最长为4位',
        reg_client_cpm_error_msg: '客户版CPM价格必须为数值，并且整数位最长为12位，小数位最长为4位',
        reg_media_inventory_error_msg: '媒体库存CPM数量必须为数值，并且整数位最长为12位，小数位最长为4位',
        reg_proportion_sum_error_msg: '权重值相加不为100%，请检查！',
        reg_percents_required: '百分比值不能为空',
        reg_percents_min_max: '百分比值必须在0到100之间',
        reg_percents_error_msg: '只允许输入[0,100]之间的正整数',
        reg_base_required: '基数不能为空',
        reg_name_required: '名称不能为空',
        reg_name_length_error: '名称不能超过20个字符',
        reg_name_error_msg: '名称只允许是中文、英文、数字、中划线、下划线、括号、空格 . / 、& 50个字符以内',
        reg_number_error: '请填写数值,数值不能为空',
        reg_Minimum_inventory_discount_required: '库存折扣最小值 不能为空',
        reg_target_cost_positive_number_error_msg: '目标cost%必须为正数、最多保留2位小数',
        reg_cost_sum_not_100: '目标cost%值相加之和不等于100%，请调整',
        reg_positive_number_two_decimal: "必须为大于等于0的数字，最多保留2位小数",
        reg_between_0_1_two_decimal: "必须为0-1之间的数字，最多保留2位小数",
        reg_decimal_0_four_decimal: "请填写0~1之间的小数(包括0)，可允许小数点后4位小数",
        reg_Ad_name_error: '广告名称只允许中文、英文、数字、下划线、中划线',
        reg_percent_sum_not_100: '占比相加之和不等于100%，请调整',
        reg_CPUA_error_msg: 'CPUV为正数、最多保留3位小数',
        reg_target_max_positiveInt: '请输入正整数的最高目标值',
        reg_target_min_positiveInt: '请输入正整数的最低目标值',
        reg_positive_number_four_decimal: '仅支持正数最多保留4位小数',
        reg_role_name_length_error: '角色名称长度最大为20个字符',
        reg_agent_name_length_error: '代理名称长度最大为20个字符',
        reg_true_name_length_error: '用户姓名不能超过25个字符',
        reg_true_name_error: '用户姓名只允许输入中文、英文',
        reg_client_name_length_error: '客户名称不能超过30个字符',
        reg_client_name_error_msg: '客户名称只允许是中文、英文、数字、中划线、下划线、括号、空格、括号 . / 、 - _  &',
        reg_client_name_required: '客户名称不能为空',
        reg_abbreviation_logo_required: '简称和Logo必须必填其一', 
        reg_abbreviation_required: '简称不能为空', 
        reg_abbreviation_rule_error: '简称只允许填写最多2位的英文数字组合或者最多4位纯数字', 
        reg_upload_picture_form_error: '上传图片只能是 JPG、PNG 格式!',
        reg_upload_picture_size_error: '上传图片大小不能超过 50KB!',
        reg_upload_picture_square_error: '上传图片只能为正方形',
        reg_sort_positive_integer: '序号值只能是正整数',
        reg_chinese_name_required: '中文名称不能为空',
        reg_chinese_name_error_required: '中文名称只允许是中文',
        reg_chinese_name_length_error: '中文名称的长度只能在[2,20]个字符之间',
        reg_english_name_required: '英文名称不能为空',
        reg_english_name_error_required: '英文名称只允许是英文和()',
        reg_english_name_length_error: '英文名称的长度只能在[2,20]个字符之间',
        reg_media_name_required: '媒体名称不能为空',
        reg_media_name_error_required: '媒体名称只允许是中文、英文、&、()字符的组合',
        reg_media_name_length_error: '媒体名称的长度只能在[2,20]个字符之间',
        reg_MIS_media_name_required: 'MIS媒体名称不能为空',
        reg_MIS_media_name_error_required: '只允许是中英文、数字、-_(),首位必须是字母或者汉字',
        reg_MIS_media_name_length_error: '长度只能在[2,30]个字符之间',
        reg_select_primary_classification_placeholder: '请选择媒体一级分类',
        reg_select_second_classification_placeholder: '请选择媒体二级分类',
        reg_select_pbs_name_placeholder: '请选择PBS媒体名称',
        reg_MIS_position_name_required: 'MIS点位名称不能为空',
        reg_MIS_position_not_allowed: '不允许单引号，双引号',
        reg_MIS_position_length_error: '长度只能在[2,30]个字符之间',
        reg_positive_integer_two_decimal: '仅支持正数最多保留2位小数',
        reg_value_length_1_30: '长度只能在[1,30]个字符之间', 
        reg_email_error: '请输入合法的电子邮箱地址',
        reg_phone_error: '请输入合法的手机号码',
        reg_password_length_error: '用户密码长度最少8位最多20位',
        reg_password_rule_error: '仅支持英文、数字、特殊字符!-+*@#$.中的至少2种组合',
        reg_role_name_error_msg: '英文、中文、数字、下划线、中划线，首位不能是下划线、中划线',
        reg_username_length_error: '用户名称长度最少2位最多20位',
        reg_username_error_msg: '用户姓名仅支持英文、数字、下划线、中划线，首位必须是字母',
    
    },
    ...zhLocale
}

export default zh
