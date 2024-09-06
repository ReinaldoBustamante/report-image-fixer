export interface ReportType {
    id: number
    attributes: ReportAttributes
}

export interface Comment {
    id?: number
    content: string
    date: Date
}
export interface Check {
    id?: number
    status: Boolean
    date: Date
}
export interface Disease {
    id?: number
    name: string
    certainty: Number
}
export interface Label {
    id?: number
    zone: string
    property: string
    case: string
    observation: string
    imageCharacteristics: any
}

export interface ReportAttributes {
    idGlobal: string
    uuid: string
    weight: number
    shoot: Date
    metadata: any
    comment: Comment[]
    check: Check[]
    disease: Disease[]
    labels: Label[]
    revisado: boolean
    pcr: boolean
    createdAt?: Date
    updatedAt?: Date
    images: any,
    enterprise?: number
}