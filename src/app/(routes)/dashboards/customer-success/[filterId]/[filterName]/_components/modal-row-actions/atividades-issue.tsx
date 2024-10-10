import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useJiraComments } from '@/http/jira/get-jira-comments-issue-id';
import { KeyboardOff } from 'lucide-react';

interface AtividadesIssue {
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

interface AtividadesIssuesProps {
	issueId: string;
}

export function AtividadesIssues({ issueId }: AtividadesIssuesProps) {
	const { data, isLoading, error } = useJiraComments(issueId);

	if (isLoading)
		return (
			<p className="text-xs text-muted-foreground">Carregando atividades...</p>
		);

	if (error)
		return (
			<p className="text-xs text-muted-foreground">
				Erro ao carregar comentários.
			</p>
		);

	// Verifica se há comentários
	if (!data?.comments?.length) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
				<KeyboardOff className="w-10 h-10" />
				<p className="text-sm">Nenhuma atividade encontrada</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{data.comments.map((atividade: AtividadesIssue) => (
				<div key={atividade.id} className="flex items-start space-x-3">
					<Avatar className="w-6 h-6">
						<AvatarImage
							src={atividade.author.avatarUrls['32x32']}
							alt={atividade.author.displayName}
						/>
						<AvatarFallback>{atividade.author.displayName[0]}</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-semibold text-xs">
									{atividade.author.displayName}
								</p>
								<p className="text-xs text-muted-foreground">
									{new Date(atividade.created).toLocaleString()}
								</p>
							</div>
						</div>
						<p className="mt-1 text-xs">
							{atividade.body.content[0].content[0].text}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
