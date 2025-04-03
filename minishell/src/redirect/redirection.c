/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redirection.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/24 20:43:11 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:43:25 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static int	redirect_simple(t_cmd **cmd, size_t pos, int fd)
{
	int	new_fd;

	if (!(*cmd)->argv[pos + 1])
		return (0);
	if (!fd)
		new_fd = open((*cmd)->argv[pos + 1], O_RDONLY);
	else if (fd == 1)
		new_fd = open((*cmd)->argv[pos + 1], O_WRONLY | O_CREAT | 0x0400, 0777);
	else
		new_fd = open((*cmd)->argv[pos + 2], O_WRONLY | O_CREAT | 0x0008, 0777);
	if (new_fd == -1)
		ft_fprintf(1, BYEL "%s : can't open file\n" BWHT, (*cmd)->argv[pos + 1]);
	(*cmd)->fd[fd % 2] = new_fd;
	(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
	(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
	if (fd == 3)
	{
		(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
		return (-3);
	}
	return (-2);
}

int	redirect_status(t_cmd *cmd, size_t pos)
{
	int	nb;

	nb = -1;
	if (ft_sublen(cmd->argv[pos], '\0') == 1)
	{
		if (cmd->argv[pos][0] == '<')
			nb = 0;
		else if (cmd->argv[pos][0] == '>')
			nb = 1;
		if (cmd->argv[pos + 1] && ft_sublen(cmd->argv[pos + 1], '\0') == 1)
			if (cmd->argv[pos][0] == cmd->argv[pos + 1][0])
				nb += 2;
	}
	return (nb);
}

int	init_redirect(t_cmd *cmd)
{
	size_t	div;
	int		redirect_type;

	div = -1;
	cmd->fd[0] = -2;
	cmd->fd[1] = -2;
	cmd->fd[2] = -2;
	redirect_type = -1;
	while (cmd->argv && cmd->argv[++div] && write(0, "", 1) != -1)
	{
		redirect_type = redirect_status(cmd, div);
		if ((redirect_type <= 1 || redirect_type == 3) && redirect_type > -1)
			div += redirect_simple(&cmd, div, redirect_type);
		else if (redirect_type == 2)
			div += new_heredoc(&cmd, div, -1, 0);
		if (redirect_type > 1 && cmd->argv[div + 1])
			div++;
	}
	return (0);
}
