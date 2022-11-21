// replace /public with url to s3bucket to use it from AWS
//then after 08 done replace it with CloudFront Distribution Domain name to retrieve data from cache
const base = '/public'
module.exports = {
  hamster1: base + '/images/hamster-1-final.png',
  hamster2: base + '/images/hamster-2-final.png',
  hamster3: base + '/images/hamster-3-final.png',
  hamster4: base + '/images/hamster-4-final.png',
  hamster5: base + '/images/hamster-5-final.png',
  hamster6: base + '/images/hamster-6-final.png',
  heart_active: base + '/images/heart.active.png',
  heart_inactive: base + '/images/heart.inactive.png',
  main_ball: base + '/images/main-ball-final.png',
  settings: base + '/images/settings.png'
}
