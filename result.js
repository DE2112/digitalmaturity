import {blocks, formAnswers, departments} from './models.js'

export let result_page_params = {
    title: 'Результат',
    active: 'result',
    blocks: await blocks.findAll({raw:true}),
    departments: await departments.findAll({raw:true}),
    avg_results_by_dep: []
}

export async function getResults(req, res) {

    result_page_params.blocks = await blocks.findAll({raw:true})
    result_page_params.departments = await departments.findAll({raw:true})

    let avgResultsByDep = []
    for (let i = 0; i < result_page_params.departments.length; i++) {
        let results = await formAnswers.findAll({
            where: {
                department_id: result_page_params.departments[i]['department_id']
            }
        })

        if (results.length == 0) {
            avgResultsByDep[i] = [0, 0, 0, 0, 0, 0, 0]
            continue
        }


        let avgResults = []
        for (let j = 0; j < 7; j++) {
            avgResults[j] = 0
            for (let k = 0; k < results.length; k++) {
                avgResults[j] += results[k]['results'][j] * (100 / 9)
            }

            //console.log(results[0]['results'])

            avgResults[j] /= results.length
            avgResults[j].toFixed(2)
        }

        avgResultsByDep[i] = avgResults
        console.log(avgResultsByDep[i])
    }

    result_page_params.avg_results_by_dep = avgResultsByDep
    res.render('result', result_page_params)
}