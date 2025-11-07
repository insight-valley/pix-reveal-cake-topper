import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "./LordIcon";
import { toast } from "sonner";

interface FeedbackFormProps {
  imageId: string;
  prompt: string;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackForm({
  imageId,
  prompt,
  onFeedbackSubmitted,
}: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar feedback no localStorage (pode ser enviado para API depois)
      const feedback = {
        imageId,
        prompt,
        rating,
        comment,
        timestamp: Date.now(),
      };

      const existingFeedback = JSON.parse(
        localStorage.getItem("cake-topper-feedback") || "[]"
      );
      existingFeedback.push(feedback);
      localStorage.setItem(
        "cake-topper-feedback",
        JSON.stringify(existingFeedback)
      );

      // Aqui você pode fazer uma chamada para API para salvar no banco
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedback) });

      setHasSubmitted(true);
      toast.success("Obrigado pelo seu feedback! 💚");
      onFeedbackSubmitted?.();
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
      toast.error("Erro ao salvar feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <Card className="border-success-200 bg-success-50">
        <CardContent className="p-6 text-center">
          <p className="text-success-700 font-semibold">
            Obrigado pelo seu feedback! 💚
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          A imagem foi criada como você esperava?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-transform hover:scale-110 ${
                rating && rating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <StarIcon
                size={32}
                trigger={rating && rating >= star ? "loop" : "hover"}
                colors={{
                  primary:
                    rating && rating >= star ? "#fbbf24" : "#d1d5db",
                }}
              />
            </button>
          ))}
        </div>

        {rating && (
          <div className="space-y-2">
            <Textarea
              placeholder="Comentários adicionais (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
