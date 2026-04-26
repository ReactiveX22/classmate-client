"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVoteOnPoll } from "@/hooks/use-vote-on-poll";
import { useUser } from "@/hooks/useAuth";
import { PollQuestionData, Post } from "@/lib/api/services/post.service";
import { getInitials } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PollCardProps {
  post: Post;
  poll: PollQuestionData;
}

export function PollCard({ post, poll }: PollCardProps) {
  const { data: user } = useUser();
  const voteOnPoll = useVoteOnPoll();
  const isAuthor = user?.id === post.authorId;
  const hasVoted = (poll.viewerVoteOptionIds?.length ?? 0) > 0;
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    poll.viewerVoteOptionIds ?? [],
  );

  useEffect(() => {
    setSelectedOptionIds(poll.viewerVoteOptionIds ?? []);
  }, [poll.viewerVoteOptionIds]);

  const handleSingleChoiceVote = (optionId: string) => {
    setSelectedOptionIds([optionId]);
    voteOnPoll.mutate({
      classroomId: post.classroomId,
      postId: post.id,
      data: { optionIds: [optionId] },
    });
  };

  const handleToggleMultipleOption = (optionId: string, checked: boolean) => {
    setSelectedOptionIds((currentValue) => {
      if (checked) {
        return Array.from(new Set([...currentValue, optionId]));
      }

      return currentValue.filter(
        (currentOptionId) => currentOptionId !== optionId,
      );
    });
  };

  const showResults = isAuthor || hasVoted;

  return (
    <div className="space-y-4">
      {(() => {
        const pollOptions = poll.options.map((option) => {
          const result = poll.results?.find(
            (currentResult) => currentResult.optionId === option.id,
          );
          const isChecked = selectedOptionIds.includes(option.id);
          const optionId = `poll-option-${post.id}-${option.id}`;

          return (
            <div key={option.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {poll.selectionMode === "single" ? (
                  <RadioGroupItem
                    value={option.id}
                    id={optionId}
                    disabled={voteOnPoll.isPending}
                  />
                ) : (
                  <Checkbox
                    id={optionId}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleToggleMultipleOption(option.id, Boolean(checked))
                    }
                    disabled={voteOnPoll.isPending}
                  />
                )}
                <Label
                  htmlFor={optionId}
                  className="cursor-pointer text-sm font-normal leading-6"
                >
                  {option.text}
                </Label>
              </div>

              {showResults && result && (
                <div className="space-y-2 pl-7">
                  <Progress value={result.percentage}>
                    <div className="flex items-center gap-2 text-sm">
                      {/* <ProgressLabel>{option.text}</ProgressLabel> */}
                      <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                        {result.percentage}% ({result.voteCount})
                      </span>
                    </div>
                  </Progress>

                  {poll.canViewVoters &&
                    result.voters &&
                    result.voters.length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto px-0"
                            >
                              View voters
                            </Button>
                          }
                        />
                        <CollapsibleContent>
                          <div className="space-y-2 pt-2">
                            {result.voters.map((viewer) => (
                              <div
                                key={`${option.id}-${viewer.id}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={viewer.image || undefined}
                                  />
                                  <AvatarFallback>
                                    {getInitials(viewer.name || undefined)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{viewer.name || "Unknown user"}</span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                </div>
              )}
            </div>
          );
        });

        if (poll.selectionMode === "single") {
          return (
            <RadioGroup
              value={selectedOptionIds[0]}
              onValueChange={handleSingleChoiceVote}
              className="gap-4"
            >
              {pollOptions}
            </RadioGroup>
          );
        }

        return pollOptions;
      })()}

      {poll.selectionMode === "multiple" && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Select one or more options, then submit your vote.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={selectedOptionIds.length === 0 || voteOnPoll.isPending}
            onClick={() =>
              voteOnPoll.mutate({
                classroomId: post.classroomId,
                postId: post.id,
                data: { optionIds: selectedOptionIds },
              })
            }
          >
            {hasVoted ? "Update Vote" : "Submit Vote"}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {poll.totalVotes ?? 0} total vote{poll.totalVotes === 1 ? "" : "s"}
      </p>
    </div>
  );
}
