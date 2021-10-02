exports.search =(req, res)=> {
    const response = [{
        name: 'Cat',
        meaning: 'Con mèo',
        type: 'noun'
    },{
        name: 'Catch',
        meaning: 'Bắt kịp',
        type: 'verb'
    },{
        name: 'Cow',
        meaning: 'Con bò',
        type: 'noun'
    }]
    res.json({
        success: true,
      data: response
    })
}