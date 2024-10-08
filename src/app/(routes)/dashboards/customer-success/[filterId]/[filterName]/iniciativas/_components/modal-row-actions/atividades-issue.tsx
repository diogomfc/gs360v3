// import { useJiraComments } from '@/http/jira/get-jira-comments-issue-id';
// import type React from 'react';

// interface JiraCommentsProps {
// 	keyIssue: string;
// }

// const JiraComments: React.FC<JiraCommentsProps> = ({ keyIssue }) => {
// 	// Utilizando o hook para buscar os comentários
// 	const { data, isLoading, isError } = useJiraComments(keyIssue);

// 	if (isLoading) return <p>Carregando comentários...</p>;
// 	if (isError) return <p>Erro ao carregar comentários.</p>;

// 	return (
// 		<div>
// 			<h2>Comentários da Issue: {keyIssue}</h2>
// 			<ul>
// 				{data?.comments?.map((comment) => (
// 					<li key={comment.id}>
// 						<div>
// 							<img
// 								src={comment.author.avatarUrls['48x48']}
// 								alt={`${comment.author.displayName}'s avatar`}
// 								style={{ borderRadius: '50%', marginRight: '10px' }}
// 							/>
// 							<strong>{comment.author.displayName}</strong>
// 						</div>
// 						<div>
// 							{comment.body.content.map((contentBlock, index) =>
// 								contentBlock.content.map((textContent) => (
// 									<span key={`${index}-${textContent.text}`}>
// 										{textContent.text}
// 									</span>
// 								)),
// 							)}
// 						</div>
// 						<p>Publicado em: {new Date(comment.created).toLocaleString()}</p>
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// };

// export default JiraComments;

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useJiraComments } from '@/http/jira/get-jira-comments-issue-id';
import { SmileIcon, ThumbsUpIcon } from 'lucide-react';

interface JiraComment {
	id: string;
	body: {
		type: string;
		content: {
			type: string;
			content: {
				type: string;
				text: string;
			}[];
		}[];
	};
	author: {
		accountId: string;
		displayName: string;
		emailAddress: string;
		avatarUrls: {
			'48x48': string;
			'24x24': string;
			'16x16': string;
			'32x32': string;
		};
	};
	created: string;
	updated: string;
}

interface JiraCommentsProps {
	issueId: string;
}

export default function JiraComments({ issueId }: JiraCommentsProps) {
	const { data, isLoading, error } = useJiraComments(issueId);

	if (isLoading) return <p>Carregando comentários...</p>;
	if (error) return <p>Erro ao carregar comentários.</p>;

	return (
		<div className="space-y-4">
			{data?.comments?.map((comment: JiraComment) => (
				<div key={comment.id} className="flex items-start space-x-3">
					<Avatar className="w-6 h-6">
						<AvatarImage
							src={comment.author.avatarUrls['32x32']}
							alt={comment.author.displayName}
						/>
						<AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
					</Avatar>
					<div className="flex-1 mb-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-semibold text-xs">
									{comment.author.displayName}
								</p>
								<p className="text-xs text-muted-foreground">
									{new Date(comment.created).toLocaleString()}
								</p>
							</div>
						</div>
						<p className="mt-1 text-xs">
							{comment.body.content[0].content[0].text}
						</p>
						{/* <div className="flex items-center mt-2 space-x-2">
							<ThumbsUpIcon className="w-4 h-4 text-muted-foreground" />
							<SmileIcon className="w-4 h-4 text-muted-foreground" />
						</div> */}
					</div>
				</div>
			))}
		</div>
	);
}
