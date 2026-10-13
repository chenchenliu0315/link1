/*
 * 穿搭推荐数据：年龄段人群偏好、七类造型单品库、天气策略和星座幸运色。
 * 推荐器按年龄 × 造型 × 天气动态组合，因此数据规则覆盖全部 210 种基础组合。
 */
window.OUTFIT_DATA = {
  ageGroups: [
    { id: 'child', label: '儿童', range: '6–12 岁', note: '自在好动，穿得舒服也穿得有趣', keywords: ['轻松', '好活动', '明亮色彩'] },
    { id: 'teen', label: '青少年', range: '13–17 岁', note: '保留个性，也照顾每天的舒适度', keywords: ['新鲜', '自我表达', '轻松叠穿'] },
    { id: 'young', label: '青年', range: '18–35 岁', note: '在表达自己与实穿之间找到平衡', keywords: ['有态度', '好搭配', '自在'] },
    { id: 'middle', label: '中年', range: '36–55 岁', note: '质感、从容与日常实穿恰到好处', keywords: ['利落', '质感', '耐穿'] },
    { id: 'senior', label: '乐龄', range: '55+ 岁', note: '自在舒适，穿出轻盈精神气', keywords: ['舒适', '轻盈', '柔和配色'] }
  ],
  weather: [
    { id: 'sunny', label: '晴天', icon: '☀', note: '轻薄透气，让阳光成为配色的一部分', temp: '22°' },
    { id: 'cloudy', label: '多云', icon: '☁', note: '适度叠穿，应对早晚温差', temp: '18°' },
    { id: 'rainy', label: '雨天', icon: '☂', note: '选择快干面料与防滑鞋底', temp: '16°' },
    { id: 'snowy', label: '雪天', icon: '❄', note: '保暖层次与防水外层都要到位', temp: '−3°' },
    { id: 'hot', label: '高温', icon: '✳', note: '优先天然透气面料，减少闷热感', temp: '34°' },
    { id: 'cold', label: '寒冷', icon: '♨', note: '贴身保暖与外层防风缺一不可', temp: '4°' }
  ],
  moods: [
    { id: 'happy', label: '开心', icon: '☼', color: '#e88550', note: '用明快色调放大好心情' },
    { id: 'calm', label: '平静', icon: '◌', color: '#688479', note: '柔和中性色让节奏慢下来' },
    { id: 'tired', label: '疲惫', icon: '☾', color: '#8793a0', note: '选择柔软亲肤、无需费力的搭配' },
    { id: 'excited', label: '兴奋', icon: '✳', color: '#d5a447', note: '小面积亮色点缀，让能量继续' },
    { id: 'sad', label: '难过', icon: '☁', color: '#71899b', note: '包裹感和温柔的颜色，给自己一点照顾' }
  ],
  zodiac: [
    { id: 'aries', label: '白羊座', date: '03.21–04.19', color: '珊瑚红', hex: '#d96b52', tags: ['活力', '行动派'] },
    { id: 'taurus', label: '金牛座', date: '04.20–05.20', color: '鼠尾草绿', hex: '#84977b', tags: ['质感', '自然'] },
    { id: 'gemini', label: '双子座', date: '05.21–06.21', color: '明黄', hex: '#e8bc51', tags: ['灵动', '好奇'] },
    { id: 'cancer', label: '巨蟹座', date: '06.22–07.22', color: '珍珠白', hex: '#eee8d9', tags: ['温柔', '细腻'] },
    { id: 'leo', label: '狮子座', date: '07.23–08.22', color: '琥珀金', hex: '#c78c43', tags: ['自信', '热情'] },
    { id: 'virgo', label: '处女座', date: '08.23–09.22', color: '橄榄绿', hex: '#7e8660', tags: ['简洁', '秩序'] },
    { id: 'libra', label: '天秤座', date: '09.23–10.23', color: '雾霾蓝', hex: '#879eaa', tags: ['平衡', '优雅'] },
    { id: 'scorpio', label: '天蝎座', date: '10.24–11.22', color: '酒红', hex: '#803e4b', tags: ['深邃', '坚定'] },
    { id: 'sagittarius', label: '射手座', date: '11.23–12.21', color: '紫红', hex: '#a75f77', tags: ['自由', '探索'] },
    { id: 'capricorn', label: '摩羯座', date: '12.22–01.19', color: '炭灰', hex: '#52565a', tags: ['可靠', '克制'] },
    { id: 'aquarius', label: '水瓶座', date: '01.20–02.18', color: '电光蓝', hex: '#568a9c', tags: ['独立', '新意'] },
    { id: 'pisces', label: '双鱼座', date: '02.19–03.20', color: '海盐绿', hex: '#78a39a', tags: ['浪漫', '想象'] }
  ],
  styles: [
    { id: 'commute', label: '通勤', icon: '▤', mood: '利落有分寸', ages: ['smart-casual', 'clean lines', 'relaxed tailoring', 'quiet luxury', 'soft tailoring'], top: { name: '挺括棉质衬衫', detail: '柔软有型，不易起皱', image: 'photo-1598554747436-c9293d6a588f' }, bottom: { name: '直筒九分西裤', detail: '垂坠利落，活动自在', image: 'photo-1594633312681-425c7b97ccd1' }, shoes: { name: '轻量乐福鞋', detail: '通勤久走也舒适', image: 'photo-1531310197839-ccf54634509e' }, accessory: { name: '简约皮革托特包', detail: '收纳日常，也提升质感', image: 'photo-1548036328-c9fa89d128fa' }, photo: 'photo-1483985988355-763728e1935b' },
    { id: 'casual', label: '休闲', icon: '⌂', mood: '松弛不费力', ages: ['playful layers', 'campus casual', 'everyday ease', 'weekend classic', 'easy elegance'], top: { name: '柔软纯棉圆领上衣', detail: '亲肤透气，日常百搭', image: 'photo-1529139574466-a303027c1d8b' }, bottom: { name: '宽松锥形休闲裤', detail: '轻松活动，版型有余量', image: 'photo-1594633312681-425c7b97ccd1' }, shoes: { name: '复古轻便运动鞋', detail: '柔软鞋底，适合长时间行走', image: 'photo-1542291026-7eec264c27ff' }, accessory: { name: '帆布斜挎包', detail: '轻便好收纳，出门更自在', image: 'photo-1548036328-c9fa89d128fa' }, photo: 'photo-1529139574466-a303027c1d8b' },
    { id: 'sport', label: '运动', icon: '↗', mood: '轻盈有活力', ages: ['active play', 'street sport', 'sporty mix', 'athleisure', 'easy movement'], top: { name: '速干透气运动上衣', detail: '吸湿排汗，活动不黏腻', image: 'photo-1551488831-00ddcb6c6bd3' }, bottom: { name: '弹力运动长裤', detail: '四向弹力，动作不受限', image: 'photo-1594633312681-425c7b97ccd1' }, shoes: { name: '缓震训练鞋', detail: '支撑稳定，适合多种活动', image: 'photo-1542291026-7eec264c27ff' }, accessory: { name: '轻量运动腕包', detail: '随身放好小物与钥匙', image: 'photo-1553062407-98eeb64c6a62' }, photo: 'photo-1538805060514-97d9cc17730c' },
    { id: 'formal', label: '正式', icon: '◇', mood: '从容而得体', ages: ['occasion ready', 'polished classic', 'modern formal', 'refined occasion', 'timeless polish'], top: { name: '细腻肌理感衬衫', detail: '面料挺括，细节保持克制', image: 'photo-1598554747436-c9293d6a588f' }, bottom: { name: '高腰垂感长裤', detail: '流畅线条，兼顾舒适与正式', image: 'photo-1594633312681-425c7b97ccd1' }, shoes: { name: '低跟尖头鞋', detail: '线条简洁，走路稳定', image: 'photo-1543163521-1bf539c55dd2' }, accessory: { name: '金属细节腕表', detail: '为整体增加一点精致感', image: 'photo-1523170335258-f5ed11844a49' }, photo: 'photo-1539109136881-3be0616acf4b' },
    { id: 'sweet', label: '甜美', icon: '♡', mood: '柔和有一点俏皮', ages: ['bright & sweet', 'soft romantic', 'playful feminine', 'gentle charm', 'light romantic'], top: { name: '轻柔针织开衫', detail: '触感温柔，层次轻盈', image: 'photo-1485968579580-b6d095142e6e' }, bottom: { name: '柔软垂感半裙', detail: '自然摆动，坐立都自在', image: 'photo-1583496661160-fb5886a0aaaa' }, shoes: { name: '圆头轻便玛丽珍鞋', detail: '脚感柔和，细节精致', image: 'photo-1543163521-1bf539c55dd2' }, accessory: { name: '小巧珍珠耳饰', detail: '柔和提亮脸部气色', image: 'photo-1535632066927-ab7c9ab60908' }, photo: 'photo-1539109136881-3be0616acf4b' },
    { id: 'edgy', label: '酷飒', icon: '✦', mood: '干净有态度', ages: ['street cool', 'urban edge', 'city utility', 'modern edge', 'confident ease'], top: { name: '短款机能感外套', detail: '利落线条，适合轻松叠穿', image: 'photo-1551028719-00167b16eac5' }, bottom: { name: '直筒工装长裤', detail: '口袋实用，版型保持利落', image: 'photo-1515886657613-9f3515b0c78f' }, shoes: { name: '简洁厚底短靴', detail: '稳定好走，拉长整体比例', image: 'photo-1543163521-1bf539c55dd2' }, accessory: { name: '哑光金属耳饰', detail: '小面积点缀，表达个性', image: 'photo-1535632066927-ab7c9ab60908' }, photo: 'photo-1515886657613-9f3515b0c78f' },
    { id: 'artsy', label: '文艺', icon: '⌁', mood: '安静但不单调', ages: ['creative comfort', 'indie layers', 'artful mix', 'natural texture', 'soft classic'], top: { name: '天然棉麻立领上衣', detail: '纹理自然，透气亲肤', image: 'photo-1485968579580-b6d095142e6e' }, bottom: { name: '松弛感亚麻长裤', detail: '自然垂坠，留有活动空间', image: 'photo-1594633312681-425c7b97ccd1' }, shoes: { name: '柔软复古平底鞋', detail: '轻便易穿，适合城市漫步', image: 'photo-1531310197839-ccf54634509e' }, accessory: { name: '手作感编织包', detail: '加入自然肌理和细节', image: 'photo-1548036328-c9fa89d128fa' }, photo: 'photo-1485968579580-b6d095142e6e' }
  ],
  schedule: [
    { id: 'work', label: '上班', icon: '▥', note: '舒服得体，精神刚刚好' },
    { id: 'meeting', label: '会议', icon: '▧', note: '利落可信，也留有个人风格' },
    { id: 'date', label: '约会', icon: '♡', note: '亲和柔软，让相处更自在' },
    { id: 'party', label: '聚会', icon: '✳', note: '有一点亮眼，但不需要用力' },
    { id: 'home', label: '居家', icon: '⌂', note: '松弛舒服，照顾自己的节奏' },
    { id: 'outing', label: '出行', icon: '↗', note: '方便行动，轻松应对变化' }
  ],
  weatherRules: {
    sunny: { layer: '轻薄透气面料', outer: '可备一件薄外搭', shoe: '轻便透气鞋款', palette: '清爽明亮色系' },
    cloudy: { layer: '适中厚度与可叠穿层次', outer: '备一件易穿脱外套', shoe: '包脚舒适鞋款', palette: '柔和中性色搭配' },
    rainy: { layer: '快干、易打理面料', outer: '轻量防泼水外层', shoe: '防滑耐湿鞋底', palette: '耐脏的沉稳色系' },
    snowy: { layer: '保暖内层与厚实针织', outer: '防风防水保暖外层', shoe: '防滑保暖鞋款', palette: '温暖深色与亮色点缀' },
    hot: { layer: '吸湿透气的天然纤维', outer: '减少厚重叠穿', shoe: '透气轻薄鞋款', palette: '浅色低吸热配色' },
    cold: { layer: '贴身保暖内层与羊毛混纺', outer: '防风外套或轻薄羽绒', shoe: '包覆性好的鞋款', palette: '温暖层次色系' }
  },
  moodPalettes: {
    happy: ['珊瑚橘', '奶油黄', '清新白'], calm: ['鼠尾草绿', '雾霾蓝', '米白'], tired: ['燕麦色', '浅灰', '柔雾蓝'],
    excited: ['琥珀金', '莓果红', '明黄点缀'], sad: ['暖灰', '柔粉', '海盐绿']
  },
  imageBase: 'https://images.unsplash.com/'
};