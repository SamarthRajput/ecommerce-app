import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IndustryMasterDataTypes {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

interface Props {
    industryOptions: IndustryMasterDataTypes[]
    value: string
    onChange: (value: string) => void
    error?: string
}

export function IndustrySelect({ industryOptions, value, onChange, error }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                        {industryOptions.map((industry) => (
                            <SelectItem key={industry.id} value={industry.id}>
                                {industry.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}
