import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'
import { Brand } from '../models/brand.model'

interface SeedCase {
    CaseID: string
    BrandName: string
    YearFounded: number
    Headquarters: string
    NumberOfLocations: number
    DifferentiatingFactor: string
}

export const seedDataAndLogCases = async () => {
    console.log('\nStep 3: Generating Unique Test Matrices')
    const fakerModule = await (eval(
        'import("@faker-js/faker")'
    ) as Promise<any>)
    const faker = fakerModule.faker

    const seedCases: SeedCase[] = []
    const brandsToInsert: any[] = []
    const currentYear = new Date().getFullYear()

    const cases = [
        {
            id: 'CASE_01',
            notes: 'Old brand.',
        },
        {
            id: 'CASE_02',
            notes: 'Founded this year.',
        },
        {
            id: 'CASE_03',
            notes: 'Single location.',
        },
        {
            id: 'CASE_04',
            notes: 'Many locations.',
        },
        {
            id: 'CASE_05',
            notes: 'Brand name with extra spaces to trim.',
        },
        {
            id: 'CASE_06',
            notes: 'Headquarters with accents.',
        },
        {
            id: 'CASE_07',
            notes: 'Hyphenated/ampersand brand.',
        },
        {
            id: 'CASE_08',
            notes: 'Numeric styled brand name.',
        },
        {
            id: 'CASE_09',
            notes: 'Deliberately long brand name.',
        },
        {
            id: 'CASE_10',
            notes: 'Typical mid-size consumer brand.',
        },
    ]

    for (let i = 0; i < 10; i++) {
        const profile = cases[i]

        let brandName = faker.company.name()
        let yearFounded = faker.number.int({ min: 1601, max: currentYear - 1 })
        let headquarters = faker.location.city()
        let numberOfLocations = faker.number.int({ min: 2, max: 1000 })

        switch (profile.id) {
            case 'CASE_01':
                yearFounded = 1600
                break
            case 'CASE_02':
                yearFounded = currentYear
                break
            case 'CASE_03':
                numberOfLocations = 1
                break
            case 'CASE_04':
                numberOfLocations = 1200
                break
            case 'CASE_05':
                brandName = '  Riverside & Co  '
                break
            case 'CASE_06':
                headquarters = 'München'
                break
            case 'CASE_07':
                brandName = 'Smith-Jones & Partners'
                break
            case 'CASE_08':
                brandName = 'Studio 54 Apparel'
                break
            case 'CASE_09':
                brandName =
                    'The International Collective of Artisanal Producers'
                break
            case 'CASE_10':
                break
        }

        const generatedBrand = {
            brandName: brandName.trim(),
            yearFounded,
            headquarters: headquarters.trim(),
            numberOfLocations,
        }

        brandsToInsert.push(generatedBrand)

        seedCases.push({
            CaseID: profile.id,
            BrandName: generatedBrand.brandName,
            YearFounded: generatedBrand.yearFounded,
            Headquarters: generatedBrand.headquarters,
            NumberOfLocations: generatedBrand.numberOfLocations,
            DifferentiatingFactor: profile.notes,
        })
    }

    for (const d of brandsToInsert) {
        const testDoc = new Brand(d)
        await testDoc.validate()
    }

    await Brand.insertMany(brandsToInsert)

    const dataDir = path.join(__dirname, '../../data')
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(seedCases)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Seeding Documentation')
    XLSX.writeFile(workbook, path.join(dataDir, 'seed-cases.xlsx'))
    console.log('Generated seed-cases.xlsx file.')
}
