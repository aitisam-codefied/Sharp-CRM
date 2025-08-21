import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Eye } from "lucide-react";

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  version: string;
  lastUpdated: string;
  mandatory: boolean;
}

interface Stats {
  mandatoryDocuments: number;
}

interface MandatoryDocumentsProps {
  filteredDocuments: Document[];
  handleViewDocument: (docId: string) => void;
  stats: Stats;
}

export default function MandatoryDocuments({
  filteredDocuments,
  handleViewDocument,
  stats,
}: MandatoryDocumentsProps) {
  return (
    stats.mandatoryDocuments > 0 && (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Mandatory Reading Documents
          </CardTitle>
          <CardDescription className="text-orange-600">
            {stats.mandatoryDocuments} documents require mandatory reading by
            all staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocuments
              .filter((doc) => doc.mandatory)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium text-orange-900">{doc.title}</p>
                    <p className="text-sm text-orange-600">{doc.description}</p>
                    <p className="text-xs text-orange-500">
                      {doc.category.charAt(0).toUpperCase() +
                        doc.category.slice(1)}{" "}
                      • {doc.version} • Updated {doc.lastUpdated}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDocument(doc.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Read Now
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  );
}
