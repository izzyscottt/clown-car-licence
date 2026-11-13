//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/filters/
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('formatDate', function (day, month, year) {
  if (!day || !month || !year) return ''
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return day + ' ' + months[parseInt(month) - 1] + ' ' + year
})