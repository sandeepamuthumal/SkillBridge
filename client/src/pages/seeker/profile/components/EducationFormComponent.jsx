import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Save,
    X,
} from 'lucide-react';

export default function EducationFormComponent({
    currentEducation,
    handleInputChange,
    handleSwitchChange,
    onSubmit,
    onCancel,
    submitText
}) {
    return (
        <Card className="border-blue-200">
            <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="degree">Degree *</Label>
                        <Input
                            id="degree"
                            placeholder="e.g., Bachelor of Computer Science"
                            value={currentEducation.degree}
                            onChange={(e) => handleInputChange('degree', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                        <Input
                            id="fieldOfStudy"
                            placeholder="e.g., Computer Science"
                            value={currentEducation.fieldOfStudy}
                            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="university">University/Institution *</Label>
                    <Input
                        id="university"
                        placeholder="e.g., University of Colombo"
                        value={currentEducation.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startYear">Start Year *</Label>
                        <Input
                            id="startYear"
                            type="number"
                            placeholder="2020"
                            min="1950"
                            max={new Date().getFullYear()}
                            value={currentEducation.startYear}
                            onChange={(e) => handleInputChange('startYear', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endYear">End Year</Label>
                        <Input
                            id="endYear"
                            type="number"
                            placeholder="2024"
                            min="1950"
                            max={new Date().getFullYear() + 10}
                            value={currentEducation.endYear}
                            onChange={(e) => handleInputChange('endYear', e.target.value)}
                            disabled={currentEducation.currentlyStudying}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="currentlyStudying"
                        checked={currentEducation.currentlyStudying}
                        onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="currentlyStudying">I am currently studying here</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="3.50"
                        value={currentEducation.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                    />
                </div>

                <div className="flex gap-2 pt-4">
                    <Button onClick={onSubmit} className="gap-2">
                        <Save className="h-4 w-4" />
                        {submitText}
                    </Button>
                    <Button variant="outline" onClick={onCancel} className="gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}