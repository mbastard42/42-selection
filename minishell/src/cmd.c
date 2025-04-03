/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cmd.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 20:02:38 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:16:38 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

static char	*get_path(char *argv)
{
	size_t	i;
	int		last;

	i = -1;
	last = -1;
	if (argv[0] == '.')
		return (NULL);
	while (argv[++i])
		if (argv[i] == '/' && argv[i + 1])
			last = i;
	if (last == -1)
		return (NULL);
	return (ft_substr(argv, 0, last + 1));
}

t_cmd	*new_cmd(t_data *data, char **tab)
{
	t_cmd	*cmd;
	char	**tmp;

	cmd = (t_cmd *)malloc(sizeof(t_cmd));
	tmp = expended(data, tab, 0);
	cmd->argv = ft_tabdup(tab, NULL);
	cmd->path = get_path(tmp[0]);
	tmp[0] = ft_strcut(tmp[0], 0, ft_sublen(cmd->path, 0), 1);
	init_redirect(cmd);
	cmd->argv = expended(data, cmd->argv, 1);
	if (cmd->argv)
		if_free(cmd->argv[0]);
	if (cmd->argv)
		cmd->argv[0] = ft_strdup(tmp[0]);
	cmd->next = NULL;
	free_tab(tmp);
	free_tab(tab);
	return (cmd);
}

void	add_cmd(t_cmd **cmds, t_cmd *cmd)
{
	t_cmd	*view;

	view = *cmds;
	if (cmds && *cmds)
	{
		while (view->next)
			view = view->next;
		view->next = cmd;
	}
	else if (cmds)
		*cmds = cmd;
}

void	del_cmds(t_cmd **cmds)
{
	t_cmd	*view;
	t_cmd	*tmp;

	view = *cmds;
	while (cmds && view)
	{
		tmp = view->next;
		free_tab(view->argv);
		if (view->path)
			free(view->path);
		free(view);
		view = tmp;
	}
	*cmds = NULL;
}
