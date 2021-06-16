import enLocale from 'element-ui/lib/locale/lang/en';

const en = {
    lang: {
        overall_language: 'english', // 特殊定义，便于复杂文本编写
        // login登录页文本
        login_system_value: '<p style="font-size: 34px;"><span style="color:#42A996">Big data engine </span><span>helps brand owners seize<br />the opportunity of getting the best media resources</span></p>',
        login_system_apply: 'An Intelligent media decision-making platform integrating insight, analysis, execution, and monitoring',
        login_form_title: 'Login your account',
        login_button_text: 'Sign in',
        login_button_text_ing: 'Signing in',
        login_username_placeholder: 'Username',
        login_password_placeholder: 'Password',
        login_vcode_placeholder: 'Verification code',
        login_vcode_refresh: 'Click Refresh verification code',
        login_username_require: 'Username is required.',
        login_username_rule: 'Username length must be 2~20 characters.',
        login_password_require: 'Password is required.',
        login_password_rule: 'Password length must be 8~20 characters.',
        login_vcode_require: 'Verification code is required.',
        login_vcode_rule: 'Verification code length must be 4 characters.',
        // layout文本
        layout_info_title: 'Personal',
        layout_logout: 'Log out',
        layout_skin: 'Skin',
        layout_skin_dark: 'Dark',
        layout_skin_light: 'Light',
        layout_help_title: 'Help Center',
        layout_help_tooltip: 'Click to download the operation manual',
        layout_agent_placeholder: 'Please select agent',
        // 一级导航
        first_nav_allocation_strategy: 'Allocation Strategy',
        first_nav_media_strategy: 'Media Strategy',
        first_nav_system_management: 'System Management',
        // 二级导航
        secondary_nav_OTV_OTT: ' OTV/OTT Medium',
        secondary_nav_display: 'Display Medium',
        secondary_nav_medium_recommendation: "PBS's recommendation",
        secondary_nav_roles_manage: 'Roles',
        secondary_nav_users_manage: 'Users',
        secondary_nav_clients_manage: 'Clients',
        secondary_nav_OTV_OTT_rules_manage: 'OTV/OTT Rules',
        secondary_nav_medium_manage: 'Medium Management',
        secondary_nav_operation_log: 'Operation Log',
        // 三级导航
        third_nav_project_list: 'Project List',
        third_nav_archived_project: 'Archived Projects',
        third_nav_add_project: 'Create Project',
        third_nav_budget_list: 'Display Budget Allocation',//Display预算分配
        third_nav_add_budget: 'Create Budget Allocation',//新增预算分配
        third_nav_media_ranking: 'Media Ranking',
        third_nav_position_ranking: 'Position Ranking',
        third_nav_device_coverage_ranking: 'Media Coverage Ranking',
        third_nav_media_overlap_ranking: 'Media Overlap Ranking',
        // 面包屑导航（媒体管理特殊，有点长，单独定义）
        media_breadcrumb: 'HY.PBS Medium Recommendation',
        // 通用组件文本
        public_client_placeholder: 'Please select client',  // 客户下拉筛选
        public_client_label: 'Client',
        public_client_All: 'All Clients',
        public_brand_placeholder: 'Please select brand',  // 品牌下拉筛选
        public_brand_label: 'Brand',
        public_brand_All: 'All Brands',
        public_product_placeholder: 'Please select product',  // 产品下拉筛选
        public_product_label: 'Product',
        public_product_All: 'All Products',
        public_port_placeholder: 'Please select device',  // 端口下拉筛选
        public_port_label: 'Device',
        public_port_All: 'All Devices',
        public_project_placeholder: 'Please select project',  // 项目下拉筛选
        public_project_label: 'Project',
        public_project_All: 'All Projects',
        public_status_placeholder: 'Please select status',  // 状态下拉筛选
        public_status_label: 'Status',
        public_status_All: 'All Status',
        public_DatePicker_start: 'Start Date',  // 时间选择器
        public_DatePicker_between: '-',
        public_DatePicker_end: 'End Date',
        public_key_words: 'Keywords Search',  // 关键字搜索提示
        public_input_client_placeholder: 'Please enter client name', 
        public_industry_placeholder: 'Please select industry',
        public_industry_label: 'Industry',//行业
        public_industry_All: 'All Industry',//全部行业
        public_project_period_placeholder: 'Please select period',
        public_period_label: 'Period',   // 周期
        public_audience_placeholder: 'Please select audience gender',  //请选择人群性别
        public_audience_label: 'Audience',  // 人群
        public_target_audience_label: 'Target Audience', //目标人群
        public_version_placeholder: 'Please select version',  // 版本
        public_version_label: 'Version',
        public_current_version_label: 'Current Version',  // 当前版本
        public_submit_data_label: 'Submit Data',  // 提交数据，非提交
        public_project_name_placeholder: 'Please enter project name', // 名称name
        public_project_name: 'Name', // 名称name
        public_add_one_more: 'Add one more',
        public_enter_placeholder: 'Please enter',
        public_media_placeholder: 'Please select media', // 请选择媒体
        public_media_label: 'Media', //媒体
        public_media_type_placeholder: 'Please select media type', //请选择媒体类型
        public_media_type_label: 'Media Type', //媒体类型
        public_city_placeholder: 'Please select city', // 请选择城市
        public_enter_adName_placeholder: 'please enter Ad name', //请输入广告名称
        public_period_placeholder: 'Please select period', //请选择周期
        public_budget_placeholder: 'Please enter budget', //请输入项目预算
        public_budget_label: 'Budget', //预算
        public_target_placeholder: 'Please select target', //请选择目标
        public_target_label: 'Target', //目标
        public_age_gender_placeholder: 'Please select gender and age', //请选择性别和年龄
        public_age_placeholder: 'Please select gender', //请选择年龄
        public_Goal_label: 'Target',//目标函数
        public_Goal_placeholder: 'Please select target', //请选择目标函数
        public_all_Target: 'All Target',//全部目标函数
        public_maximum_placeholder: 'Maximum', //上限
        public_minimum_placeholder: 'Minimum', //下限
        public_position_placeholder: 'Please select position', //请选择点位
        public_Media_primary_classification_placeholder: 'Media primary classification', //媒体一级分类
        public_Media_second_classification_placeholder: 'Media secondary classification',//媒体二级分类
        public_MediaA_placeholder: 'Media A', //媒体A
        public_MediaB_placeholder: 'Media B', //媒体B
        public_role_level_placeholder: 'Please select role level',//请选择角色级别
        public_all_level_label: 'All Classifications',//全部级别
        public_level1_label: '1st_level',//一级
        public_level2_label: '2nd_level',//二级
        public_all_agent: 'All Agents',//全部代理
        public_role_name: 'Role Name',//角色名称
        public_role_name_placeholder: 'Please enter role name',//请输入角色名称
        public_role_level_label: 'Role Level',//角色级别
        public_agent_name_placeholder: 'Please enter agent name',//请输入所属代理名称
        public_phone_placeholder: 'Please enter phone number',//请输入手机号码
        public_email_placeholder: 'Please enter email',//请输入电子邮箱
        public_enter_password_placeholder: 'Please enter password',//请输入用户密码
        public_enter_password_again_placeholder: 'Please enter password again',//请再次输入用户密码
        public_confirm_password_error: 'Two passwords do not match.', //两次输入密码不一致!
        public_enter_user_name_placeholder: 'Please enter user name',//请输入用户名称
        public_enter_true_name_placeholder: 'Please enter true name',//请输入用户姓名
        public_select_role_placeholder: 'Please select role',//请选择用户角色
        public_shortName_placeholder: 'Please enter abbreviation',// 请输入简称
        public_shortName_label: 'Abbreviation',//简称
        public_chinese_name_placeholder: 'Please enter chinese name',//请输入中文名称
        public_english_name_placeholder: 'Please enter english name',//请输入英文名称
        public_media_name_placeholder: 'Please enter media name',//请输入媒体名称
        public_MIS_media_name: 'Please enter MIS Media name',//请输入MIS媒体名称
        public_pbs_media_search: 'Please select PBS media ID/name, support multiple selection and fuzzy search. ',//PBS媒体ID/名称,可多选,支持模糊搜索查找
        public_select_primary_classification_placeholder: 'Media primary classification',//请选择媒体一级分类
        public_select_second_classification_placeholder: 'Media secondary classification',//请选择媒体二级分类
        public_select_Bid_type_placeholder: 'Please select Bid type',//请选择竞价类型
        public_Bid_type_label: 'Bid Type',//竞价类型
        public_algorithmSupport_placeholder: 'Algorithm Support',//算法支持
        public_MIS_position_name_placeholder: 'Please enter MIS position name',//请输入MIS点位名称
        public_position_name_placeholder: 'Please enter position name',//请输入点位名称
        public_select_MIS_media_placeholder: 'Please select MIS media',//请选择所属MIS媒体
        public_select_selling_unit_placeholder: 'Please select selling unit',//请选择售卖单位
        public_select_related_pbs_id_placeholder: 'Please select related PBS ID',//请选择关联PBS ID
        // 多为组件使用
        public_empty_list_text: 'No data',  // 列表无数据匹配
        public_no_update_text: 'No update', //暂无更新
        public_fold: 'Fold',  // 收起
        public_unfold: 'Unfold',  // 展开
        public_load_more: 'Load More',  // 加载更多
        public_loading: 'Loading...',
        public_close: 'Close',
        public_gender: 'Gender', //性别
        public_male: 'Male',   //男
        public_female: 'Female',  // 女
        public_all: 'All',
        public_age: 'Age', //年龄
        public_example: 'Example',
        public_operation_manual: 'Operation Guide',
        public_add: 'Add ', // 新增
        public_upload: 'Upload', //上传
        public_upload_picture: 'Upload Picture',//上传图片
        public_uploading: 'Uploading', //上传中
        public_uploaded: 'Uploaded', //上传完成
        public_upload_success: 'Upload successfully.',
        public_upload_again: 'Re-upload',  //重传
        public_upload_again_success: 'Re-uploaded successfully.',
        public_select_file: 'Select File',  //选择文件
        public_upload_fail: 'Upload fail, please upload again!', //上传失败，请稍后重试!
        public_upload_condition: 'Please upload a square picture in jpg/png format, no more than 50KB.',//允许上传格式为jpg/png的正方形图片，不超过50KB
        public_operate: 'Operate',  // 操作
        public_type: 'Type',  // 类型
        public_other: 'Other Contents', // 其他
        public_edit_success: 'Edit successfully.', // 编辑成功！
        public_delete_success: 'Delete successfully.', //删除成功
        public_add_success: 'Add successfully.', // 添加成功
        public_required: 'is required', //不能为空
        public_delete_confirm: 'Are you sure you want to delete this ', //您确定要删除
        public_unable_to: 'Unable to ', //无法进行
        public_The_server_is_processing: 'the server is processing...', //服务器正在处理中
        public_preview: 'Preview', //预览区
        public_back: 'The Previous Step', //返回上一步
        public_Start_calculating: 'Start Calculate', //开始计算
        public_view_last_result: 'View Last Result',//查看上次结果
        public_Again_calculating: 'Recalculating',//重新计算
        public_number_unit: ' th', //个
        public_under_19: 'Under 19 years old', //19岁以下
        public_over_50: 'Over 50 years old', //50岁以上
        public_selected: 'Selected', //已选
        public_Readable: 'Readable',//可读
        public_Writable: 'Writable',//可写
        public_request_fail: 'Request fail!',//数据获取失败
        public_support: 'Support',//支持
        public_not_support: 'Not support',//不支持
        public_day: 'day', //天
        public_checkAll: 'Check All',//全选
        public_handle_empty: 'Empty',//清空
        public_start: 'Start',//开始使用
        // 共用表头（可能）
        public_table_monthly_unique_devices_zh: 'Monthly Unique Devices（10K）',
        public_table_monthly_unique_devices_en: 'Monthly Unique Devices(10K)',
        // tooltip或其他共用
        public_tooltip_draft: 'Draft',  // 草稿
        public_tooltip_finish: 'Finished',  // 完成
        public_tooltip_detail: 'Detail',  // 详情
        public_tooltip_edit: 'Edit ',  // 编辑
        public_tooltip_show: 'Show',  // 查看
        public_tooltip_download: 'Download',  // 下载
        public_tooltip_history: 'History',  // 历史
        public_tooltip_archives: 'Archives',  // 归档
        public_tooltip_delete: 'Delete',  // 删除
        public_tooltip_activating: 'Activating',  // 激活
        public_tooltip_more: 'More', // 更多
        public_tooltip_base: 'Base', // 基数
        public_tooltip_ranking: 'Ranking', // 排名
        public_tooltip_total_score: 'Total Score', // 总分
        public_tooltip_scored: 'Score', // 权重后
        public_tooltip_ascending_order: 'Ascending Order', // 正序计算
        public_tooltip_descending_order: 'Descending Order', // 倒序计算
        public_tooltip_add: 'Add ', // 添加
        public_tooltip_error: 'Error', // 错误
        public_tooltip_on: 'On',//启用
        public_tooltip_off: 'Off',//禁用
        public_tooltip_permission: 'Permission',//权限
        public_tooltip_first: 'First',//置顶
        public_tooltip_arrow_top: 'Move Up',//上移一位
        public_tooltip_arrow_down: 'Move Down',//下移一位
        public_tooltip_last: 'Last',//置底
        public_tooltip_sort: 'Sort',//序号
        public_tooltip_create: 'Add ',//新建
        public_tooltip_back_to_top: 'Back To Top',//回到顶部
    
        public_button_confirm: 'Ok', // 确认按钮
        public_button_save: 'Save', // 中文保存按钮
        public_button_submit: 'Submit', // 中文提交按钮
        public_button_continue: 'Continue', // 中文继续按钮
        public_button_cancel: 'Cancel', // 取消按钮
        public_dialog_point: 'Tips',  // 确认弹框提示文字
        public_dialog_warning: 'Warning',  // 确认弹框警告文字

        // layout文本配置
        layout_logout_confirm: 'Are you sure you want to log out ?  Edits have not been saved will be discarded.',//确认要退出系统吗？如有仍未保存的编辑内容会被舍弃?
        layout_download_operation_manual: 'Do you need to download HYMIS operation manual',//您是否需要下载HYMIS操作手册？
    
        // 分配策略-项目管理列表 Allocation Strategy => AS
        AS_no_client_point1: 'Before adding a new Project，please go to【System Management】>【',  // 项目列表未创建客户信息提示
        AS_no_client_point2: '】 to create and manage your clients, brands and products .',  // 项目列表未创建客户信息提示
        AS_no_client_tooltip: 'Click jump to create a new client',  // 项目列表未创建客户信息提示
        AS_no_project_point1: 'You have not created a project yet, please click 【',  // 项目列表未创建任何一条项目数据
        AS_no_project_point2: '】 to add your first one.',  // 项目列表未创建任何一条项目数据
        AS_no_project_tooltip: 'Click jump to create a new project',  // 项目列表未创建任何一条项目数据
        AS_no_archived_project: 'You have no archived projects.',   // 没有归档项目
        AS_no_project_list_permission: 'You currently do not have project list permissions',  // 没有项目列表权限
        AS_no_create_client_permission: 'You do not have the permission to create clients , please ask your administrator to create.',
        AS_no_create_project_permission: 'You do not have the permission to create projects , please contact your administrator to get it.',
        AS_project_detail: 'Project Detail', // 项目详情弹框title

        // 分配策略->项目详情
        AS_detail_project_info_title: 'Project Info', // 基本信息弹框title
        AS_detail_years_old: 'years old',  // 岁
        AS_detail_target_CPM: 'Target CPM Allocation', //目标CPM
        AS_detail_allocation: 'Allocation', //分量
        AS_detail_basic_info_helpTitle: 'Create or modify the basic information of the project, including project name, campaign cycle, customer, brand, product, devices, target audience.',  // basic info帮助提示
        AS_detail_basic_info_money_unit: '¥',  // basic info人民币单位
        AS_detail_basic_data_helpTitle: "Table format of 'Basic Data','Target CPM'and 'Reach Goal'.",  // basic data帮助提示
        AS_detail_basic_data_media_label: 'All Media',
        AS_detail_basic_data_market_label: 'All Market',
        AS_detail_basic_data_create_form: {
            media_inventory: 'Media Inventory（CPM）',   //媒体库存CPM
            inventory_discount: 'Inventory Discount', //库存折扣
            CPM_unit_cost_for_client: 'CPM Unit Cost for Client', //客户版CPM价格
            CPM_nit_cost_for_media: 'CPM Unit Cost for Media',  //媒体版CPM价格
            target_CPM: 'Target CPM'  //目标CPM
        },
        AS_detail_basic_data_delete_confirm: 'Are you sure you want to delete this line?',  //您确定要删除此行吗?
        AS_detail_basic_data_example_title: 'Basic Data Table Format',
        AS_detail_basic_data_example_basic_data: {
            describe: 'Basic Data provides basic data support for allocating budget, including target markets，medium, CPM unit cost, media inventory, etc.',
            format1: '①Table naming rules:BD_Project ID_Project Name.xlsx , eg:BD_01-1-1-1_ELCPromoting.xlsx',
            format2: '②Media&Market：Be filled in according to the ',
            format3: ' naming rules, and consistent with other forms. Market should be filled in English.',
            format4: '③Inventory Discount: Fill in a float between 0-1, such as "0.500" or ‘0.5’, which means a 50% discount. At the same time，this discount here will be used as the upper limit when calculating the budget allocation. System will keep the calculating results to four decimal places.',
            format5: '④CPM Unit Cost for Client or Media： Fill in the numbers，valid range: >0.System will keep to four decimal places.'
        },
        AS_detail_basic_data_example_target_cpm: {
            describe: 'Target CPM is the goal of the amount of advertisements that users want to put on the target markets.',
            format1: '①Table naming rules:TC_Project ID_Project Name.xlsx , eg:TC_01-1-1-1_ELCPromoting.xlsx',
            format2: '②Market：Be filled in according to the ',
            format3: ' naming rules, and consistent with other forms. Market should be filled in English.',
            format4: '③Target CPM:Fill in integers, valid range: >0.',
            format5: '④The upload content of the Target CPM table cannot have empty columns, otherwise the upload failed.'
        },
        AS_detail_basic_data_example_reach_goal: {
            describe: 'Reach goal is the expected target of advertising performance that users hope to achieve on the target markets.',
            format1: '①Table naming rules:RG_Project ID_Project Name.xlsx , eg:RG_01-1-1-1_ELCPromoting.xlsx',
            format2: '②Market：Be filled in according to the ',
            format3: ' naming rules, and consistent with other forms. Market should be filled in English.',
            format4: '③Reach Goal：',
            format5: 'a.frequency，Fill in integers, valid range: >0.',
            format6: 'b.reach：Fill in the percentage numbers, valid range: 0-100%,eg:"35%"',
            format7: '④The upload content of the Reach Goal table cannot have empty columns, otherwise the upload failed.'
        },
        AS_detail_basic_data_reach_to_cpm: "Are you sure you want to switch to 'Target CPM' ?  'Reach Goal' data will be deleted.", // 是否确认切换【目标CPM】，【Reach Goal】数据将被清空
        AS_detail_basic_data_cpm_to_reach: "Are you sure you want to switch to 'Reach Goal'  ?  'Target CPM' data will be deleted.", //是否确认切换【Reach Goal】，【目标CPM】数据将被清空
        AS_detail_basic_data_before_handle: 'Please finish editing your data before ', //请先完成您的数据编辑，然后再进行
        AS_detail_basic_data_before_delete: 'Please finish editing your data before deleting', //请先完成您的数据编辑，然后进行删除操作
        AS_detail_basic_data_upload_check: "Please click 'submit' button to confirm the data you uploaded.", //您上传了新数据,请点击【提交】按钮确认
        AS_detail_basic_data_preview_config: {
            reach_goal: 'Media Inventory', //媒体库存
            customer_cpm: 'CPM Unit Cost for Client' //客户版CPM价格
        },
        AS_detail_score_card_guaranteed_base: 'Guaranteed Base',  //保底基数
        AS_detail_score_card_delete_column: 'Are you sure you want to delete this column of data', //您确定要删除此列数据吗
        AS_detail_score_card_example_title: 'Score Card table format', //Score Card 表格规范
        AS_detail_score_card_helpTitle: "Table format of 'Score Card'.",  //Score Card上传表格规范说明
        AS_detail_score_card_example_score_card: {
            describe: 'Score Card is a media socring table which is completed by different dimension indicators, indicator proportions and composite calculation rankings for each media.The higher the score, the higher the ranking of the media.',
            format1: '①Table naming rules:SC_Project ID_Project Name.xlsx , eg:SC_01-1-1-1_ELCPromoting.xlsx',
            format2: '②Proportion：Fill in the percentage numbers, valid range: 0-100%, the total of the filled-in numbers is 100%.',
            format3: '③Media&Market：Market should be filled in English, and consistent with other forms.',
            format4: 'Be filled in according to the market&media naming rules.',
            format5: '④Index column ：Including Monthly Unique Devices（10K)，TGI,CPM,Performance, etc. Fill in numbers,which can be kept to four decimal places.',
            format6: '⑤Calculation Method: Fill in "1" means that the larger the initial value, the higher the score, and fill in "-1 ”meas the opposite.',
            format7: '⑥Overlapping:If you need to use overlapping calculation, please upload Overlapping Data table, then the system will calculatiing results.',
        },
        AS_detail_score_card_example_over_lapping: {
            describe: 'Overlapping Data is a secondary table for media scoring, and new scores can be generated from media overlapping data in each market.',
            format1: '①Table naming rules:OL_Project ID_Project Name.xlsx , eg:OL_01-1-1-1_ELCPromoting.xlsx',
            format2: '②Media&Market：Market should be filled in English，and consistent with other forms. ',
            format3: 'Be filled in according to the market&media naming rules',
            format4: '③Media overlapping data：Fill in the percentage numbers, valid range: 0-100%,which can be kept to four decimal places.',
        },
        AS_detail_score_card_editing: 'There is data being edited,',   //存在正在编辑的数据
        AS_detail_score_card_adding: 'There is data being created,',  //存在正在新建的数据
        AS_detail_score_card_finish_editing: 'please finish editing first.',  //请先完成编辑
        AS_detail_score_card_finish_adding: 'please finish creating first.',  //请先完成新建
        AS_detail_score_card_unable_to_filter: 'Cannot use filtering',  //不可使用过滤
        AS_detail_reach_curve_helpTitle: "Table format of 'Reach Curve'.", //Reach Curve上传表格规范说明
        AS_detail_reach_curve_example_title: 'Reach Curve table format',
        AS_detail_reach_curve_example: {
            describe: 'Reach Curve comes from the data provided by Miaozhen, and the system locates the target IMP according to the Market&Reach Goal uploaded by Basic Data.',
            format1: '①Table naming rules:RC_Project ID_Project Name.xlsx , eg:RC_01-1-1-1_ELCPromoting.xlsx',
            format2: '② Reach Curve contains at least one sheet. （The total number of sheets depends on how many markets.）',
            format3: '③The sheet name should use the market name in English, ',
            format4: 'and the Market name must be filled in according to the rules ',
            format5: 'and match with the Basic Data.',
            format6: '④The table format and fields must be consistent with the "Sample Table" above.',
        },
        AS_detail_component_compute_new_version: 'A new version of the project has been built', //已生成项目新版本
        AS_detail_component_compute_title: 'Budget Allocation', //分量计算
        AS_detail_component_compute_helpTitle: 'Show the initial result of budget allocation, and user could adjust the media ‘inventory discount’ or ‘target cost%’ to generate a new result.',
        AS_detail_component_compute_table: {
            target_CPM: 'Target CPM Allocation', //目标CPM
            media_inventory: 'Media Inventory（CPM）', //媒体库存CPM
            inventory_discount: 'Inventory Discount', //库存折扣
            calculated_inventory: 'Calculated Inventory', //计算库存
            Round_off_number: 'Round-off Number', //分量取整
            GAP_title: 'GAP （The value of actual CPM allocation minus target CPM allocation）', //目标与实际分量CPM差异(GAP)
            CPM_nit_cost_for_media: 'CPM Unit Cost for Media', //媒体版CPM价格
            total_cost_for_media: 'Total Cost for Media',  //媒体版总价格
            CPM_unit_cost_for_client: 'CPM Unit Cost for Client', //客户版CPM价格
            total_cost_for_client: 'Total Cost for Client', //客户版总价格
            target_cost: 'Target COST%', //目标cost%
        }, 
        AS_detail_component_compute_Target_cost_setting: 'Target COST Setting', //进入目标COST设置
        AS_detail_component_compute_COST_Goal_Settings: 'COST% Goal Settings', //目标COST%调整表
        AS_detail_component_compute_Minimum_inventory_discount: 'Minimum inventory discount', //库存折扣最小值
        AS_detail_component_compute_upload_target_cost: 'Upload target COST%',  //上传目标cost%
        AS_detail_component_compute_Calculation: 'Calculation', //进行分量计算
        AS_detail_component_compute_cannot_cost_setting: "Please delete the 'Final Result' tab before returning to the' Pending Result' tab to reset 'Target Cost%' .", //不能进行目标COST设置，请先删除结果表后，可以重新进行设置
        AS_detail_component_compute_inventory_discount_tooHigh: 'No solution, the minimum inventory discount is set too high, please set to lower it and try again.', //分量无解，库存折扣最小值设置过高，请尝试调低重新求解
        AS_detail_component_compute_fine_tune_cost: "No solution, please fine-tune 'Target Cost%' setting and try again.", //分量无解，请微调目标cost%设置，重新求解
        AS_detail_component_compute_cannot_to_filter: "Please finish the 'inventory discount' editing before filtering.", //请先完成库存折扣的编辑再进行过滤筛选
        AS_detail_component_compute_finish_ID_modification_first: "Please finish 'Inventory Discount' modification first.", //请先完成您的库存折扣修改
        AS_detail_component_compute_new_budget_result: 'A new budget allocation result has been generated.', //此项目已生成新版分配结果
        AS_detail_component_table_title: 'Allocation Table', //分量表
        AS_detail_component_table_title_compute: 'Budget Allocation Table', //分量计算表
        AS_detail_component_table_helpTitle: 'The system generates the final result of budget allocation according to Step4, users can switch to view the initial or final result, and download them.', //系统根据Step4生成最终媒体分量表，可切换查看初始或调整分量表，可下载分量表excel格式文件
        AS_detail_component_table_config: {
            cpm_differ: 'GAP',
            GAP_title: 'The value of actual CPM allocation minus target CPM allocation',
            reach_goal: 'Reach Goal',
            real_reach: 'Actual Reach', //实际Reach
            goal_cpm: 'Target CPM Allocation', //目标CPM
            real_cpm: 'Actual CPM Allocation', //实际分量CPM
        },
        AS_detail_component_table_preview_config: {
            real_reach: 'Actual Reach', //实际Reach
            goal_cpm: 'Target CPM', //目标CPM
            real_cpm: 'Actual Allocation', //实际分量
            customer_total_cost: 'Total Cost for Client' //客户版total Cost
        },
        AS_detail_schedule_table_title: 'Spotplan Table', //排期表
        AS_detail_schedule_table_helpTitle: 'The system generates the final soptplan, and users can download it.', //系统根据输入条件生成最终媒体排期表，可下载排期表excel格式文件
        AS_detail_schedule_table_config: {
            web_site: 'Web Site', //网站位置
            ad_name: 'Ad Name', //广告名称
            unit_quantity: 'Numbers', //单位数量
            unit: 'Unit', //单位
            start_day: 'Start Date', //点位开始时间
            end_day: 'End Date', //点位结束时间
        },
        AS_detail_schedule_table_delete_confirm: 'Are you sure you want to delete this Spotplan Table?', //您确定要删除该排期表吗
        AS_detail_schedule_table_edit_form: {
            ad_name: 'Ad Name',
            period_Proportion: 'Cycle&Ratio', //周期及占比
            percent: '',
        },
        AS_detail_schedule_table_delete_setting_confirm: 'Are you sure you want to delete this Advanced setting?',//您确定要删除该条高级设置吗
        AS_detail_schedule_table_preview_config: {
            web_site: 'Web Site', //网站位置
            unit_quantity: 'Numbers', //单位数量
            start_day: 'Start Date', //点位开始
            end_day: 'End Date', //点位结束
        },
        AS_detail_schedule_table_Advanced_settings_error: 'Note：Advanced settings are optional. If you set them, this part will be removed from the general settings for special processing.', //注：高级设置非必填项，若进行设置，则此部分将从通用设置中剔除做特殊处理
        AS_detail_schedule_table_Advanced_settings_ranking_number: "Advanced settings' the ", //高级设置的第

        // 项目详情通用文本
        AS_detail_sample_table: 'Sample Table：',
        AS_detail_specification: 'Specification：',
        AS_detail_download_form_template: 'Download the template',  //下载源模板
        AS_detail_result: ' Result',  //结果
        AS_detail_initial_value: 'Initial Value', //初始
        AS_detail_download_excel: 'Download Excel', //导出excel
        AS_detail_proportion: 'Proportion', //比重
        AS_detail_media: 'media', //媒体版
        AS_detail_client: 'client', //客户版
        AS_detail_Spotplan_setting: 'Spotplan Setting', //排期设置
        AS_detail_back_step4: 'Return to Step4', //返回step4
        AS_detail_common_setting: 'Setting', //通用设置
        AS_detail_advanced_setting: 'Advanced Setting', // 高级设置

        // 预算分配
        budget_ta_percent: 'TA%', // TA占比
        budget_no_permission: 'You currently do not have budget list permissions',//暂无预算分配权限
        budget_step1_title: 'Basic information of the project', //项目基本信息配置
        budget_Maximum_target: 'Please enter maximum target', //请输入最低目标值
        budget_Minimum_target: 'Please enter minimum target',//请输入最低目标值
        budget_coverage_label: ' Coverage', //覆盖数
        budget_exposures_label: 'Exposures', //曝光数
        budget_step2_title: 'Medium and positions', //媒体&点位
        budget_upload_position_table: "Upload positions' information table you chose", //上传对应的点位信息表
        budget_download_position_format_table: 'Download the format of positions information', //点位信息format下载
        budget_Start_Period_protection: 'Open cycle protection', //开启周期保护
        budget_step3_title: 'Budget allocation results', //预算分配结果
        budget_step3_result_table_config: {
            media_type: 'Media Type', //媒体类型
            media: 'Media', //媒体
            position: 'Position', //点位
            uv: 'Est.coverage', //预估覆盖
            ta: 'TA%', //
            win: 'Est.IMP', //预估曝光
            price: 'Budget Allocation', //分配预算
            days: 'Purchase Days', //购买天数
        },
        budget_step4_title: 'KPI estimation', //KPI预估
        budget_step4_kpi_table_config: {
            media_type: 'Media Type', //媒体类型
            media: 'Media', //媒体
            CPM: 'Est.CPM', //预估CPM
            CPC: 'Est.CPC', //预估CPC
            CPL: 'Est.CPL', //预估CPL
            CTR: 'Est.CTR', //预估CTR
            CPUV: 'Est.CPUV', //预估CPUV
        },
        budget_Calculate_fail: 'No solution, please adjust the setting conditions and try again.',
        budget_port_change_fail: 'The device you selected contains PC/WAP that does not support TA% as a goal.',

        // 媒介策略  Media Strategy
        MS_Strategy_management: 'Strategy Management', //策略管理
        MS_title: 'The following data are based on the actual advertising data of HY DSP.',//以下数据均以华扬DSP真实投放数据为依据
        MS_uv: 'Monthly Unique Devices（10K）',//月独立设备数(万台)
        MS_uv_tooltip: 'The number of unique devices for each media on monthly.',//按月度展示的媒体独立设备覆盖数据
        MS_uv_no_unit: 'Monthly Unique Devices',//月独立设备数
        MS_devices: 'Devices（10K）',//设备数(万台)
        MS_10K: '（10k, Unique devices）',//万台
        MS_10K_: '(10k, Unique devices)',
        MS_area: 'Area',//地区
        MS_date_picker_format: 'yyyy-MM',//yyyy 年 MM 月
        // 媒体重合表
        MS_Media_coincide_table_config: {
            id: 'id', //序号
            media: 'Media Name',//媒体名称
            mediaOneLevel: 'Media primary classification',//媒体一级分类
            mediaTwoLevel: 'Media secondary classification',//媒体二级分类
            uv: 'Monthly Unique Devices（10K）',//月独立设备数(万台)
            union_uv: 'Numbers of unique devices（10K）',//AUB不重复设备数(万台)
            intersection_uv: 'Numbers of common devices (10K)',//AnB共同设备数(万台)
            overlap_rate: 'Overlapping',//重合度
        },
        // 媒体覆盖排名表
        MS_media_cover_rank_table_config: {
            rank: 'Rank',//排名
            media: 'Media Name',//媒体名称
            level_1_name: 'Media primary classification',//媒体一级分类
            level_2_name: 'Media secondary classification',//媒体二级分类
            uv: 'Monthly Unique Devices（10K）',//月独立设备 (万台)
            uv_title: 'The number of unique devices for each media on monthly.',//按月度展示的媒体独立设备覆盖数据
        },
        MS_media_cover_rank_Age_composition: 'Age Composition',//人群年龄占比
        MS_media_cover_rank_user_total: 'total : ',//用户总数
        MS_media_cover_rank_Geographical_distribution: 'Geographical distribution',//使用地域占比
        MS_media_cover_rank_all_area: 'Total',//全区
        MS_media_cover_rank_Gender_composition: 'Gender Composition',//人群性别占比
        // 媒体综合排名表
        MS_media_cph_rank_table_config: {
            rank: 'Rank',//排名
            media: 'Media Name',//媒体名称
            level_1_name: 'Media primary classification',//媒体一级分类
            level_2_name: 'Media secondary classification',//媒体二级分类
            score: 'Comprehensive Score',//综合评分
            score_tooltip: 'Score based on the number of audience covered by each media and the comprehensive effect of historical placement data.',//媒体覆盖数、以及历史投放数据综合效果打分
            increase: 'The month-on-month growth',//环比增幅
            increase_tooltip: 'The growth rate of the selected month compared to the previous month.'//媒体选中月与前一个月环比增长比率
        },
        // 媒体综合排名表
        MS_point_cph_rank_table_config: {
            rank: 'Rank',//排名
            pos_name: 'Position Name',//点位名称
            media: 'Media name',//媒体名称
            level_1_name: 'Media primary classification',//媒体一级分类
            level_2_name: 'Media secondary classification',//媒体二级分类
            ports: 'Device Type',//终端类型
            score: 'Comprehensive score',//综合评分
            increase: 'The month-on-month growth',//环比增幅
        },

        // 系统管理
        // 角色管理
        system_add_new_role: 'Add Role', //新增角色
        system_role_permission: 'Permission',
        system_role_table_config: {
            role_name: 'Role Name',//角色名称
            agent_level_name: 'Role Level',//角色级别
            agent_name: 'Agent',//所属代理
            ctime: 'Creation Time',//创建时间
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            status_en: 'On',//启用
            status_un: 'Off',//停用
            operate: 'Operation'//操作
        },
        system_role_no_user_delete_confirm: 'Are you sure you want to delete this role?',//您确定要删除该角色吗?
        system_role_users_delete_confirm: "Are you sure you want to delete this role？ The related users' permissions will be cleared.",//您是否确认要删除此角色，关联用户权限会被清空
        system_role_switch_level_confirm: 'Switching the role level will cause the data that has been set to be lost. Are you sure you want to continue?',//切换角色级别，会导致已设置的数据丢失，是否继续?
        system_role_delete_fail: 'Delete fail, please delete again!',//删除角色失败，请稍后重试
        system_role_add_title: 'Add Role',//新建角色
        system_role_edit_title: 'Edit Role',//编辑角色
        system_role_Permissions_configuration: 'Permissions Configuration',//权限配置
        system_role_Generate_Permissions: 'Generate Permissions',//生成权限
        system_role_client_permission: 'Client Permissions',//客户权限
        system_role_delete_permission_confirm: 'Are you sure you want to delete this permission?',//您确定要删除该权限吗?
        system_role_Client_permissions_empty: 'Client permissions of the following item are blank.',//如下权限项-客户权限为空
        system_role_Section_permissions_empty: 'Section permissions of the following item are blank.',//如下权限项-板块权限为空
        system_role_permissions_empty: 'Permission list of the following item are blank.',//如下权限对应的权限列表为空
        system_role_continue_submit_confirm: 'Are you sure you want to submit?',//您确定继续提交吗
        system_role_all_section: 'All Section',//全部板块
        system_role_section_permission: 'Section Permissions',//板块权限
        // 用户管理
        system_user_add: 'Add User',
        system_user_table_config: {
            username: 'User Name',//用户名称
            agent_level_name: 'Role Level',//角色级别
            agent_name: 'Agent',//所属代理
            role_name: 'Role Name',//
            ctime: 'Creation Time',//创建时间
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            status_en: 'On',//启用
            status_un: 'Off',//停用
            operate: 'Operation'//操作
        },
        system_user_detail_title: 'User Detail',//用户详情
        system_user_name_label: 'User Name',//用户名称
        system_user_role_name_label: 'Agent',//所属角色
        system_user_true_name_label: 'True Name',//用户姓名
        system_user_phone_label: 'Phone',//手机号码
        system_user_email_label: 'Email',//电子邮箱
        system_user_account_status_label: 'Account Status',//账号状态
        system_user_last_login_label: 'Last login time',//最近登录
        system_user_add_title: 'Add User',//新建用户
        system_user_edit_title: 'Edit User',//编辑用户
        system_user_form_config: {
            username: 'User Name',//用户名称
            role_id: 'Role Name',//用户角色
            password: 'Password',//用户密码
            password_again: 'Confirm Password',//确认密码
            truename: 'True Name',//用户姓名
            phone: 'Phone',//手机号码
            email: 'Email',//电子邮箱
        },
        system_user_not_change_password: 'Please skip this box without changing the password.',//不修改密码请跳过此项
        // 客户管理
        system_client_add_title: 'Add Client',//新建客户
        system_client_add_new_brand: 'Add Brand',//新增品牌
        system_client_delete_client_confirm1: 'Are you sure you want to delete this client（',//您确定要删除该客户（
        system_client_delete_client_confirm2: '）?',
        system_client_add_new_product: 'Add Product',//新增产品
        system_client_delete_brand_confirm1: 'Are you sure you want to delete this brand（',//您确定要删除该品牌（
        system_client_delete_brand_confirm2: '）?',
        system_client_delete_product_confirm1: 'Are you sure you want to delete this product（',//您确定要删除该产品（
        system_client_delete_product_confirm2: '）?',
        system_client_get_image_size_fail: 'Failed to catch image size.',//获取图片尺寸失败
        // 规则管理
        system_rule_add_city: 'Add City',// 新增城市
        system_rule_add_media: 'Add Media',//新增媒体
        system_rule_city_list: 'City List',//城市列表
        system_rule_media_list: 'Media List',//媒体列表
        system_rule_city_table_config: {
            sort: 'Sort',//序号
            name: 'Chinese Name',//城市中文名称
            name_en: 'English Name',//城市英文名称
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            status_on: 'On',//启用
            status_off: 'Off',//停用
            rank: 'Rank',//排序
            operate: 'Operate'//操作
        },
        system_rule_city_create_form: {
            name: 'Chinese Name',//中文名称
            name_en: 'English Name',//英文名称
        },
        system_rule_city_label: 'City',//城市
        system_rule_media_table_config: {
            sort: 'Sort',//序号
            name: 'Media Name',//媒体名称
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            status_on: 'On',//启用
            status_off: 'Off',//停用
            rank: 'Rank',//排序
            operate: 'Operate'//操作
        },
        system_rule_media_create_form: {
            name: 'Media Name'//媒体名称
        },
        system_rule_media_label: 'Media',//媒体
        // 媒体管理
        system_media_add_position: 'Add Position',//新增点位
        system_media_position_list: 'Position List',//点位列表
        system_media_media_table_config: {
            id: 'MIS media id',//MIS媒体ID
            name: 'Media Name',//媒体名称
            pbs_media_name: 'Related PBS Media',//关联PBS媒体
            level_1_name: 'Media primary classification',//媒体一级分类
            level_2_name: 'Media secondary classification',//媒体二级分类
            position_id: 'Related MIS Position IDs',//关联MIS点位ID
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            status_on: 'On',//启用
            status_off: 'Off',//停用
            operate: 'Operate'//操作
        },
        system_media_pbs_media: 'Related MIS Position IDs',//关联MIS点位ID
        system_media_ids: 'The following id: ',//如下id：
        system_media_pbs_not_id: ' did not find the matching id in pbs.',//未在pbs中找到匹配id
        system_media_media_create_form: {
            id: 'MIS media id',//MIS媒体ID
            misMediaName: 'MIS media name',//MIS媒体名称
            pbsMediaName: 'PBS Media name',//PBS媒体名称
            levelOneAss: 'Media primary classification',//媒体一级分类
            levelTwoAss: 'Media secondary classification',//媒体二级分类
        },
        system_media_point_table_config: {
            id: 'MIS Position ID',//MIS点位ID
            pos_name: 'MIS Position name',//MIS点位名称
            media_name: 'MIS media name',//所属MIS媒体
            level_1_name: 'Media primary classification',//媒体一级分类
            level_2_name: 'Media secondary classification',//媒体二级分类
            pbs_media_names: 'Related PBS Media',//关联PBS媒体
            pbs_pos_id: 'Related PBS ID',//关联PBS ID
            pbs_pos_name: 'PBS Position name',//PBS点位名称
            mr: 'PBS Position MR',//PBS点位MR
            ports: 'Device',//支持端口
            bid_type: 'Bid type',//竞价类型
            rate: 'Rate card rate',//刊例价
            selling_unit: 'Unit',//售卖单位
            utime: 'Update Time',//更新时间
            status: 'Status',//状态
            operate: 'Operate',//操作
        },
        system_media_point_corresponding_ID: "'s corresponding ID is as follows: ",//对应的id如下：
        system_media_point_cerate_form: {
            misPointName: 'MIS Position name',//MIS点位名称
            levelOneAss: 'Media primary classification',//媒体一级分类
            levelTwoAss: 'Media secondary classification',//媒体二级分类
            misMedia: 'MIS media name',//所属MIS媒体
            port: 'Device',//支持端口
            bidPrice: 'Bid Type',//竞价类型
            rate: 'Rate card rate',//刊例价
            selling_unit: 'Unit',//售卖单位
            relationPbsId: 'Related PBS ID',//关联PBS ID
            algorithmSupport: 'Algorithm Support',//算法支持
        },
        system_media_point_support_budget: 'Support budget allocation results of Display media',//支持PDB媒体预算分配
        system_media_point: ' point',//点位
        system_media_point_clear_related_PBS_ID: 'Are you sure you want to clear the selected related PBS ID?',//您确定要清空已选的关联PBS ID吗?
        system_media_point_rate_card_rate: 'Please fill in the rate card rate',//请输入刊例价
        // 操作日志
        system_operate_account: 'User',//操作账号
        system_operate_account_placeholder: 'All Users',//操作账号
        system_operate_role: 'Role',//操作角色
        system_operate_role_placeholder: 'All Roles',//操作角色
        system_operate_section: 'Section',//操作板块
        system_operate_section_placeholder: 'All Sections',//操作板块
        system_operate_type: 'Type',//操作类型
        system_operate_type_placeholder: 'All Types',//操作类型
        system_operate_table_config: {
            act_time: 'Time',//操作时间
            username: 'User Name',//操作账号
            role_name: 'Role Name',//操作角色
            act_model: 'Section',//操作板块
            act_object: 'Object',//操作对象
            actionname: 'Type',//操作类型
            operate: 'Operate',//变更详情
            key: 'Changes',//变更项
            old: 'Before Change',//变更前
            new: 'After Change',//变更后
        },
        system_operate_fail_get_role_list: 'Failed to get role list, please try again!',//获取角色列表失败，请稍后重试
        // 用户中心弹框
        system_user_form: {
            username: 'User Name',//用户名称
            role_id: 'Role',//用户角色
            password: 'Password',//用户密码
            password_again: 'Confirm Password',//确认密码
            truename: 'True Name',//用户姓名
            phone: 'Phone',//手机号码
            email: 'Email',//电子邮箱
        },

        // 正则判断或提示
        reg_required: 'is required',   //不能为空
        reg_cannot_submit: 'cannot submit',  //不能提交 
        reg_integer_greater_than_0: '(INT，>0 , and <150)',  //(大于0且小于150的整数)
        reg_integer_must_greater_than_0: 'Must be an integer, greater than 0 and less than 150', //必须是大于0的整数
        reg_age_error_msg: 'Age ranges cannot overlap, please fill in again.',  //年龄段不可重叠，请重新填写
        // reg_name_error_msg: 'Only allow Chinese, English letters, numbers, underscore within 30 characters.', //只允许数字、英文、中文、下划线 30个字符以内
        reg_target_CPM_required: 'Target CPM Allocation is required.', //目标CPM不能为空
        reg_target_CPM_incorrect: 'Incorrect Target CPM Allocation.', //目标CPM格式不正确，只能是正整数
        reg_reach_goal_required: 'Reach Goal is required.', //Reach Goal不能为空
        reg_reach_goal_incorrect: "Incorrect 'Reach Goal' format.", // Reach Goal格式不正确，例:4+30%
        reg_market_required: 'Market is required.', 
        reg_media_required: 'Media is required.',
        reg_CPM_unit_cost_for_client_required: 'CPM Unit Cost for Client is required.',
        reg_CPM_nit_cost_for_media_required: 'CPM Unit Cost for Media is required.',
        reg_media_inventory_required: 'Media Inventory（CPM） is required.',
        reg_inventory_discount_required: 'Inventory Discount is required.',
        reg_inventory_discount_between: 'Inventory discount（float,0~1,>0)', //库存折扣必须在 0到1之间
        reg_media_cpm_error_msg: 'The CPM unit cost must be a numeric, with integer bits up to 12 digits and reserved for 4 decimals',  //媒体版CPM价格必须为数值，并且整数位最长为12位，小数位最长为4位
        reg_client_cpm_error_msg: 'The CPM unit cost must be a numeric, with integer bits up to 12 digits and reserved for 4 decimals',  //客户版CPM价格必须为数值，并且整数位最长为12位，小数位最长为4位
        reg_media_inventory_error_msg: 'The media inventory must be a numeric, with integer bits up to 12 digits and reserved for 4 decimals',  //媒体库存CPM数量必须为数值，并且整数位最长为12位，小数位最长为4位
        reg_proportion_sum_error_msg: 'The sum of proportion is not 100%. Please check.', //权重值相加不为100%，请检查！
        reg_percents_required: 'Percentage is required',  //百分比值不能为空
        reg_percents_min_max: 'The percentage value must be between 0 and 100 ',  //百分比值必须在0到100之间
        reg_percents_error_msg: 'Only positive integers between 0 and 100 are allowed', //只允许输入[0,100]之间的正整数
        reg_base_required: 'Base Number is required', //基数不能为空
        reg_name_required: 'Name is required', //名称不能为空
        reg_name_length_error: 'Name cannot more then  20 characters in length.',//名称不能超过20个字符
        reg_name_error_msg: 'Only allow Chinese,English letters,number, - _ ()（）. / 、& within 50 characters.',//名称只允许是中文、英文、数字、中划线、下划线、括号 . /
        reg_number_error: 'Please fill in the correct numeric ，and input box cannot be blank.', //请填写数值,数值不能为空
        reg_Minimum_inventory_discount_required: 'Minimum inventory discount is required', //库存折扣最小值 不能为空
        reg_target_cost_positive_number_error_msg: "'Target cost%' must be a positive number , and 2 decimal places are allowed.", //目标cost%必须为正数、最多保留2位小数
        reg_cost_sum_not_100: "The sum of 'Target Cost%' is not 100% ,please check.", //目标cost%值相加之和不等于100%，请调整
        reg_positive_number_two_decimal: "Must be a positive number , and 2 decimal places are allowed.", //必须为大于等于0的数字，最多保留2位小数
        reg_between_0_1_two_decimal: "Must be a number between 0-1, and 2 decimal places are allowed.", //必须为0-1之间的数字，最多保留2位小数
        reg_decimal_0_four_decimal: "Please fill in a decimal between 0 and 1 (including 0), and 4 decimal places are allowed.", //请填写0~1之间的小数(包括0)，可允许小数点后4位小数
        reg_Ad_name_error: 'Only allow Chinese, English letters, numbers, _, -.', //广告名称只允许中文、英文、数字、下划线、中划线
        reg_percent_sum_not_100: "The sum of 'Proportion' is not 100% ,please check.",//占比相加之和不等于100%，请调整
        reg_CPUA_error_msg: 'CPUV is positive integer and reserves up to 3 decimals.',
        reg_target_max_positiveInt: 'Please enter a maximum goal value its must be a positive integer.',
        reg_target_min_positiveInt: 'Please enter a minimum goal value its must be a positive integer.',
        reg_positive_number_four_decimal: 'Only allow positive numbers ,and reserves 4 decimal places.',
        reg_role_name_length_error: 'Role name cannot more then 20 characters in length.', //角色名称长度最大为20个字符
        reg_agent_name_length_error: 'Agent name cannot more then 20 characters in length.',//代理名称长度最大为20个字符
        reg_true_name_length_error: 'True name cannot more then 25 characters in length.',//用户姓名不能超过25个字符
        reg_true_name_error: 'Only Chinese、English letters are allowed',//用户姓名只允许输入中文、英文
        reg_client_name_length_error: 'Client name cannot more then 30 characters in length.',//客户名称不能超过30个字符
        reg_client_name_error_msg: 'Only Chinese,English letters,number, - _ ()（）. / 、& are allowed',//客户名称只允许是中文、英文、数字、中划线、下划线、括号 . /
        reg_client_name_required: 'Client name is required',//客户名称不能为空
        reg_abbreviation_logo_required: 'Brand abbreviation or LOGO is required at least one.', //简称和Logo必须必填其一
        reg_abbreviation_required: 'Abbreviation is required',//简称不能为空
        reg_abbreviation_rule_error: 'The abbreviation is only allowed to fill in up to 4 numbers ,or up to 2 characters combined by alphabets and numbers. ', //简称只允许填写最多2位的英文数字组合或者最多4位纯数字
        reg_upload_picture_form_error: 'Upload images are only allowed in JPG, PNG format.',//上传图片只能是 JPG、PNG 格式!
        reg_upload_picture_size_error: 'Upload image size cannot exceed 50KB.',//上传图片大小不能超过 50KB!
        reg_upload_picture_square_error: 'The uploaded image must be square.',//上传图片只能为正方形
        reg_sort_positive_integer: 'Sort must be a positive number',///序号值只能是正整数
        reg_chinese_name_required: 'Chinese name is required',//中文名称不能为空
        reg_chinese_name_error_required: 'Only Chinese is allowed',//中文名称只允许是中文
        reg_chinese_name_length_error: '2 to 20 characters in length.',//中文名称的长度只能在[2,20]个字符之间
        reg_english_name_required: 'English name is required',//英文名称不能为空
        reg_english_name_error_required: 'Only English, (, ) are allowed',//英文名称只允许是英文和()
        reg_english_name_length_error: '2 to 20 characters in length.',//英文名称的长度只能在[2,20]个字符之间
        reg_media_name_required: 'Media name is required',//媒体名称不能为空
        reg_media_name_error_required: 'Only Chinese, English, &, (, ) are allowed',//媒体名称只允许是中文、英文、&、()字符的组合
        reg_media_name_length_error: '2 to 20 characters in length.',//媒体名称的长度只能在[2,20]个字符之间
        reg_MIS_media_name_required: 'MIS Media name is required',//MIS媒体名称不能为空
        reg_MIS_media_name_error_required: 'Only alphabets, Chinese, Numbers, underline ,hyphen and parenthesis are allowed. The first character must be an alphabet or Chinese character.',//只允许是中英文、数字、-_(),首位必须是字母或者汉字
        reg_MIS_media_name_length_error: '2 to 30 characters in length.',//长度只能在[2,30]个字符之间
        reg_select_primary_classification_placeholder: 'Please select Media primary classification',//请选择媒体一级分类
        reg_select_second_classification_placeholder: 'Please select Media secondary classification',//请选择媒体二级分类
        reg_select_pbs_name_placeholder: 'Please select PBS media name',//请选择PBS媒体名称
        reg_MIS_position_name_required: 'MIS position name is required',//MIS点位名称不能为空
        reg_MIS_position_not_allowed: `', ", ‘, ’, “, ” are not allowed`,//不允许单引号，双引号
        reg_MIS_position_length_error: '2 to 30 characters in length.',//长度只能在[2,30]个字符之间
        reg_positive_integer_two_decimal: 'Must be a positive number , and 2 decimal places are allowed.',//仅支持正数最多保留2位小数
        reg_value_length_1_30: '1 to 30 characters in length.', //长度只能在[1,30]个字符之间
        reg_email_error: 'Please fill in a correct e-mail address',//请输入合法的电子邮箱地址
        reg_phone_error: 'Please fill in a correct cellphone number.',//请输入合法的手机号码
        reg_password_length_error: 'Password length must be 8~20 characters.',//用户密码长度最少8位最多20位
        reg_password_rule_error: 'At least two combinations of alphabets, numbers, and special characters including!-+*@#$. are used as passwords.',//仅支持英文、数字、特殊字符!-+*@#$.中的至少2种组合
        reg_role_name_error_msg: 'Only alphabets, Chinese, Numbers, underline and hyphen are allowed. The first character cannot be underline or hyphen.',//英文、中文、数字、下划线、中划线，首位不能是下划线、中划线
        reg_username_length_error: 'Username length must be 8~20 characters.',//用户名称长度最少2位最多20位
        reg_username_error_msg: 'User names only allow alphabets, numbers, underscores, and hyphen, and the first character must be an alphabet.',//用户姓名仅支持英文、数字、下划线、中划线，首位必须是字母

    },
    ...enLocale
}

export default en
