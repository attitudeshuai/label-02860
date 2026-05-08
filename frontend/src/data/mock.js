/**
 * Mock 数据
 *
 * 提供用户、服务、公告、分类的初始数据，用于无后端模式下的演示与开发。
 */

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    email: 'admin@campus.edu.cn',
    phone: '13800138001',
    avatar: '',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    nickname: '刘志帅',
    email: 'liuzhishuai@campus.edu.cn',
    phone: '13800138002',
    avatar: '',
    role: 'user'
  }
]

export const mockServices = [
  {
    id: 1,
    title: '自助洗衣服务',
    category: '生活服务',
    description: '校园内智能自助洗衣房，支持在线预约洗衣机、烘干机，24小时开放。',
    detail: '校园自助洗衣房分布在各宿舍楼一楼，配备海尔智能洗衣机和烘干机各 20 台。支持手机端在线查看机器状态、预约排队，洗涤完成后自动推送通知。价格：普通洗涤 3 元/次，大件洗涤 5 元/次，烘干 2 元/30分钟。',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&h=400&fit=crop',
    location: '各宿舍楼一楼',
    bookingMethod: '通过平台在线预约，选择时段和机器编号即可',
    contact: '后勤服务中心 0571-88888001',
    rating: 4.5,
    openTime: '全天 24 小时'
  },
  {
    id: 2,
    title: '快递代收服务',
    category: '生活服务',
    description: '校园菜鸟驿站提供快递代收、寄件服务，支持短信通知取件。',
    detail: '校园菜鸟驿站位于学生活动中心一楼，支持各大快递公司的包裹代收与寄件业务。取件码通过短信自动发送，支持自助取件柜 24 小时取件。寄件提供顺丰、中通、圆通等主流快递，在线下单享受校园优惠价。',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop',
    location: '学生活动中心一楼',
    bookingMethod: '取件凭短信取件码，寄件可在线下单或现场办理',
    contact: '菜鸟驿站 0571-88888002',
    rating: 4.3,
    openTime: '08:00 - 21:00'
  },
  {
    id: 3,
    title: '学业辅导中心',
    category: '学习服务',
    description: '提供数学、英语、编程等科目的一对一及小班辅导服务。',
    detail: '学业辅导中心由优秀研究生和教师志愿者组成，涵盖高等数学、线性代数、大学英语、C/Java 编程等热门科目。提供一对一精讲和 5 人小班两种模式，可根据个人需求灵活预约。期末复习季提供专题冲刺班。',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    location: '图书馆三楼学习共享空间',
    bookingMethod: '在平台选择科目和时间段，提交预约申请',
    contact: '学业发展中心 0571-88888003',
    rating: 4.8,
    openTime: '周一至周五 14:00 - 21:00，周末 09:00 - 18:00'
  },
  {
    id: 4,
    title: '自助打印复印',
    category: '学习服务',
    description: '校园内多点位自助打印机，支持手机传输文件、扫码打印。',
    detail: '自助打印服务覆盖图书馆、教学楼、宿舍区三大区域，共设 15 台自助打印一体机。支持微信/平台上传文件，扫码即打。黑白打印 0.1 元/页，彩色打印 0.5 元/页，复印 0.1 元/页，支持 A3/A4 多种纸张。',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop',
    location: '图书馆、教学楼、宿舍区',
    bookingMethod: '即用即打，无需预约，扫码上传文件后自动打印',
    contact: '信息技术中心 0571-88888004',
    rating: 4.2,
    openTime: '07:00 - 23:00'
  },
  {
    id: 5,
    title: '校园健身中心',
    category: '运动健康',
    description: '配备专业健身器材的校园体育馆，提供瑜伽、搏击操等课程。',
    detail: '校园健身中心位于体育馆二楼，占地 800 平方米，配备跑步机、椭圆机、力量器械等专业设备 60 余台。每周提供瑜伽、有氧搏击、动感单车等 12 节团课。持校园卡可免费使用基础器械区，团课需提前预约。',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    location: '体育馆二楼',
    bookingMethod: '基础器械区刷校园卡入场，团课通过平台预约名额',
    contact: '体育教学部 0571-88888005',
    rating: 4.6,
    openTime: '06:30 - 22:00'
  },
  {
    id: 6,
    title: '宿舍维修报修',
    category: '生活服务',
    description: '在线提交宿舍设施报修申请，支持水电、家具、网络等问题。',
    detail: '通过平台在线提交报修工单，支持水电故障、家具损坏、空调维修、网络异常等多种类型。提交后系统自动分配维修师傅，可实时查看工单处理进度。紧急报修（如漏水、断电）优先处理，2 小时内响应。',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
    location: '全校宿舍区',
    bookingMethod: '在线填写报修单，选择故障类型和期望上门时间',
    contact: '后勤维修中心 0571-88888006',
    rating: 4.1,
    openTime: '工作日 08:00 - 17:00，紧急报修 24 小时'
  },
  {
    id: 7,
    title: '校园餐饮预订',
    category: '餐饮服务',
    description: '各食堂特色窗口在线预订，支持提前点餐、到店自取。',
    detail: '平台整合了校内 5 个食堂的特色窗口，提供菜品浏览、营养信息查看、提前下单等功能。支持设定取餐时间避免排队，到店扫码自取。每周更新当周菜单，支持过敏原标注和素食筛选。',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
    location: '第一至第五食堂',
    bookingMethod: '在线浏览菜单并下单，选择取餐时间和食堂窗口',
    contact: '饮食服务中心 0571-88888007',
    rating: 4.4,
    openTime: '早餐 06:30-09:00 / 午餐 11:00-13:30 / 晚餐 17:00-19:30'
  },
  {
    id: 8,
    title: '校园共享单车',
    category: '出行服务',
    description: '校内专属共享单车服务，扫码骑行，校园卡绑定免押金。',
    detail: '校园共享单车专为校内出行设计，投放 500 辆轻便单车。绑定校园卡免押金骑行，前 30 分钟免费，之后 0.5 元/30 分钟。校园内设置 20 个停车点，需在指定区域还车。GPS 定位实时查看附近可用车辆。',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    location: '全校 20 个停车点',
    bookingMethod: '扫描车身二维码即可解锁骑行，到达目的地锁车结算',
    contact: '校园交通管理处 0571-88888008',
    rating: 4.0,
    openTime: '全天 24 小时'
  }
]

export const mockAnnouncements = [
  {
    id: 1,
    title: '2026年春季学期开学注册通知',
    content: '各位同学：2026年春季学期将于2月24日正式开学，请同学们于2月22日至23日完成返校注册手续。注册地点为各学院教务办公室，需携带学生证和校园卡。未能按时注册的同学请提前联系辅导员办理请假手续。特别提醒：请关注校园公众号获取最新防疫要求。',
    category: '教务通知',
    publishTime: '2026-02-20',
    author: '教务处',
    isTop: true
  },
  {
    id: 2,
    title: '校园网络升级维护公告',
    content: '为提升校园网络服务质量，信息中心将于2月25日（周三）凌晨2:00至6:00进行核心网络设备升级维护。维护期间校园有线网络和无线网络（CampusWiFi）将出现短暂中断，预计影响时长约2小时。请同学们提前做好文件保存工作，避免在此时段进行在线考试或重要文件传输。如有紧急网络需求，可拨打信息中心值班电话。',
    category: '校园公告',
    publishTime: '2026-02-18',
    author: '信息技术中心',
    isTop: false
  },
  {
    id: 3,
    title: '第十届校园文化艺术节报名启动',
    content: '一年一度的校园文化艺术节即将拉开帷幕！本届艺术节以"青春绽放，逐梦未来"为主题，设有歌唱比赛、舞蹈大赛、话剧展演、摄影展、书法绘画展等多个版块。报名时间为2月24日至3月10日，各项比赛将于3月下旬至4月陆续举办。个人和团体均可报名，详情请查看各版块报名要求。组委会特设最佳人气奖、最佳创意奖等多个奖项。',
    category: '活动公告',
    publishTime: '2026-02-15',
    author: '校团委',
    isTop: true
  },
  {
    id: 4,
    title: '图书馆寒假还书提醒',
    content: '请在寒假期间借阅图书的同学注意：所有寒假借阅图书的归还截止日期为3月5日。逾期未还将按每天0.1元/册计收逾期费。如需续借，请登录图书馆系统在线办理续借手续（每本书最多续借一次，续借期限30天）。如有图书遗失，请及时到图书馆一楼服务台办理赔偿手续。',
    category: '教务通知',
    publishTime: '2026-02-12',
    author: '图书馆',
    isTop: false
  },
  {
    id: 5,
    title: '校园安全温馨提示',
    content: '开学季，校园安全不容忽视。请同学们注意以下事项：1.妥善保管个人财物，宿舍外出务必锁好门窗；2.警惕各类网络诈骗，不轻信陌生来电和短信链接；3.注意用电安全，禁止在宿舍使用大功率电器；4.骑行校园单车注意交通安全，遵守校内限速规定；5.如遇紧急情况，及时拨打校园安全热线或报警电话。平安校园，人人有责！',
    category: '安全提醒',
    publishTime: '2026-02-10',
    author: '保卫处',
    isTop: false
  },
  {
    id: 6,
    title: '2026年研究生招生复试工作安排',
    content: '2026年硕士研究生招生复试工作将于3月20日至4月10日进行。各学院复试方案将于3月15日前在研究生院官网公布。参加复试的考生请提前准备好学历证明、成绩单等材料。复试包含专业笔试、综合面试和外语口语测试三个环节。调剂系统将于3月18日开放，请有调剂意向的考生关注中国研究生招生信息网。',
    category: '教务通知',
    publishTime: '2026-02-08',
    author: '研究生院',
    isTop: false
  },
  {
    id: 7,
    title: '春季校园招聘会即将举办',
    content: '2026年春季校园大型招聘会定于3月15日（周六）在体育馆一楼举行，届时将有超过 120 家企业参会，涵盖互联网、金融、制造、教育等行业。已确认参会企业名单将于3月10日在就业指导中心官网公布。请毕业年级同学提前准备好简历，着正装出席。非毕业年级同学也可前来了解实习岗位。',
    category: '活动公告',
    publishTime: '2026-02-05',
    author: '就业指导中心',
    isTop: false
  },
  {
    id: 8,
    title: '食堂新学期菜品调整公告',
    content: '为提升师生就餐体验，新学期各食堂将进行菜品结构优化调整。第一食堂新增川湘风味窗口，第三食堂增设轻食沙拉吧，第五食堂推出少数民族特色餐饮区。同时，所有食堂将标注菜品热量和主要过敏原信息，方便师生按需选择。欢迎大家品尝并提出宝贵意见。',
    category: '校园公告',
    publishTime: '2026-01-28',
    author: '饮食服务中心',
    isTop: false
  },
  {
    id: 9,
    title: '校园健身中心春季课程表发布',
    content: '校园健身中心2026年春季团课课程表已发布！本学期新增拳击有氧、普拉提、户外瑜伽三门课程。所有团课免费面向全校师生开放，每节课限额 25 人，需提前在平台预约。课程安排：周一至周五每天2节，周末各3节。热门课程常常秒空，建议提前一周预约。',
    category: '活动公告',
    publishTime: '2026-01-25',
    author: '体育教学部',
    isTop: false
  },
  {
    id: 10,
    title: '寒假校园设施开放时间调整通知',
    content: '寒假期间校园各公共设施开放时间调整如下：图书馆开放时间为每天9:00-17:00（除夕至初三闭馆）；体育馆开放时间为每天10:00-16:00；自习室仅开放综合楼A101、A102两间，开放时间8:00-22:00。食堂仅第二食堂营业，供餐时间为午餐11:30-13:00、晚餐17:30-19:00。请留校同学合理安排时间。',
    category: '校园公告',
    publishTime: '2026-01-20',
    author: '后勤管理处',
    isTop: false
  }
]

export const mockBookings = [
  {
    id: 1001,
    userId: 2,
    serviceId: 3,
    serviceTitle: '学业辅导中心',
    date: '2026-05-15',
    timeSlot: '14:00 - 15:00',
    remark: '需要辅导高等数学',
    status: 'pending',
    createdAt: '2026-05-08T08:00:00.000Z',
    reviewedAt: null,
    reviewRemark: ''
  },
  {
    id: 1002,
    userId: 2,
    serviceId: 5,
    serviceTitle: '校园健身中心',
    date: '2026-05-12',
    timeSlot: '16:00 - 17:00',
    remark: '',
    status: 'approved',
    createdAt: '2026-05-07T10:00:00.000Z',
    reviewedAt: '2026-05-07T14:00:00.000Z',
    reviewRemark: ''
  },
  {
    id: 1003,
    userId: 2,
    serviceId: 1,
    serviceTitle: '自助洗衣服务',
    date: '2026-05-10',
    timeSlot: '09:00 - 10:00',
    remark: '3号洗衣机',
    status: 'rejected',
    createdAt: '2026-05-06T09:00:00.000Z',
    reviewedAt: '2026-05-06T11:00:00.000Z',
    reviewRemark: '该时段设备维护，请选择其他时间'
  }
]

export const serviceCategories = [
  { id: 1, name: '生活服务', icon: 'bi-house-heart', color: '#2563EB' },
  { id: 2, name: '学习服务', icon: 'bi-book', color: '#059669' },
  { id: 3, name: '运动健康', icon: 'bi-heart-pulse', color: '#EF4444' },
  { id: 4, name: '餐饮服务', icon: 'bi-cup-hot', color: '#F59E0B' },
  { id: 5, name: '出行服务', icon: 'bi-bicycle', color: '#8B5CF6' }
]
