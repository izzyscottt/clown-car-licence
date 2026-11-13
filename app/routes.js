//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/create-routes/
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fileUpload = require('express-fileupload')

// Add file upload middleware
router.use(fileUpload())

// Middleware to save form data to session
router.use((req, res, next) => {
  if (req.body) {
    req.session.data = req.session.data || {}
    Object.assign(req.session.data, req.body)
  }
  next()
})

// GET routes to display pages with saved data
router.get('/start', (req, res) => {
  res.render('start', {
    data: req.session.data || {}
  })
})

router.get('/page1', (req, res) => {
  res.render('page1', {
    data: req.session.data || {}
  })
})

router.get('/page2', (req, res) => {
  res.render('page2', {
    data: req.session.data || {}
  })
})

router.get('/page3', (req, res) => {
  res.render('page3', {
    data: req.session.data || {}
  })
})

router.get('/page4', (req, res) => {
  res.render('page4', {
    data: req.session.data || {}
  })
})

router.get('/checkyouranswers', (req, res) => {
  res.render('checkyouranswers', {
    data: req.session.data || {}
  })
})

// Page 1: Clown name validation
router.post('/page2', (req, res) => {
  const clownName = req.body.clownName || ''
  
  if (clownName.trim() === '') {
    return res.render('page1', {
      errors: {
        clownName: {
          text: 'Enter your clown name'
        }
      },
      data: {
        clownName: clownName
      }
    })
  }
  
  req.session.data = req.session.data || {}
  req.session.data.clownName = clownName
  res.redirect('/page2')
})

// Page 2: Years of experience and date validation
router.post('/page3', (req, res) => {
  const yearsOfExperience = req.body.yearsOfExperience || ''
  const dateStartedDay = req.body['date-started-day'] || ''
  const dateStartedMonth = req.body['date-started-month'] || ''
  const dateStartedYear = req.body['date-started-year'] || ''
  
  const errors = {}
  
  if (!yearsOfExperience) {
    errors.yearsOfExperience = {
      text: 'Select how many years of clowning experience you have'
    }
  }
  
  if (!dateStartedDay || !dateStartedMonth || !dateStartedDay) {
    errors.dateStarted = {
      text: 'Enter when you started clowning'
    }
  } else {
    // Validate date format: DD MM YYYY
    const dayValid = /^\d{1,2}$/.test(dateStartedDay) && dateStartedDay >= 1 && dateStartedDay <= 31
    const monthValid = /^\d{1,2}$/.test(dateStartedMonth) && dateStartedMonth >= 1 && dateStartedMonth <= 12
    const yearValid = /^\d{4}$/.test(dateStartedYear)
    
    if (!dayValid || !monthValid || !yearValid) {
      errors.dateStarted = {
        text: 'Enter a valid date. For example, 27 3 2007'
      }
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return res.render('page2', {
      errors: errors,
      data: {
        yearsOfExperience: yearsOfExperience,
        'date-started-day': dateStartedDay,
        'date-started-month': dateStartedMonth,
        'date-started-year': dateStartedYear
      }
    })
  }
  
  req.session.data = req.session.data || {}
  req.session.data.yearsOfExperience = yearsOfExperience
  req.session.data['date-started-day'] = dateStartedDay
  req.session.data['date-started-month'] = dateStartedMonth
  req.session.data['date-started-year'] = dateStartedYear
  
  res.redirect('/page3')
})

// Page 3: Experience details validation
router.post('/checkyouranswers', (req, res) => {
  const experienceDetails = req.body.experienceDetails || ''
  
  if (experienceDetails.trim() === '') {
    return res.render('page3', {
      errors: {
        experienceDetails: {
          text: 'Tell us about your clowning experience'
        }
      },
      data: {
        experienceDetails: experienceDetails
      }
    })
  }
  
  req.session.data = req.session.data || {}
  req.session.data.experienceDetails = experienceDetails
  
  res.redirect('/checkyouranswers')
})

// Page 4: Clown certificate upload validation
router.post('/page4', (req, res) => {
  // Handle clearing the file
  if (req.body && req.body.clearFile === 'true') {
    req.session.data = req.session.data || {}
    req.session.data.clownCertificateFileName = null
    req.session.data.clownCertificateData = null
    return res.render('page4', {
      data: req.session.data
    })
  }
  
  const errors = {}
  
  // Check if a file was uploaded
  if (!req.files || !req.files.clownCertificate) {
    errors.clownCertificate = {
      text: 'Select a file to upload'
    }
    
    return res.render('page4', {
      errors: errors,
      data: req.session.data || {}
    })
  }
  
  const file = req.files.clownCertificate
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxFileSize = 10 * 1024 * 1024 // 10MB
  
  // Validate file type
  if (!allowedMimes.includes(file.mimetype)) {
    errors.clownCertificate = {
      text: 'File must be a PDF or image (JPEG, PNG, GIF, WebP)'
    }
  }
  
  // Validate file size
  if (file.size > maxFileSize) {
    errors.clownCertificate = {
      text: 'File size must be 10MB or less'
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return res.render('page4', {
      errors: errors,
      data: req.session.data || {}
    })
  }
  
  // Convert file to base64 data URL
  const base64Data = file.data.toString('base64')
  const dataUrl = `data:${file.mimetype};base64,${base64Data}`
  
  req.session.data = req.session.data || {}
  req.session.data.clownCertificateFileName = file.name
  req.session.data.clownCertificateData = dataUrl
  
  res.render('page4', {
    data: req.session.data
  })
})
