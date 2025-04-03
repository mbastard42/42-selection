/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   heredoc.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/24 20:15:58 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:43:00 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

char	**get_input(char *delimiter)
{
	char	**input;
	char	*line;

	input = NULL;
	line = NULL;
	if (!delimiter)
		return (NULL);
	while (delimiter && ft_strncmp(line, delimiter, ft_sublen(delimiter, '\0')))
	{
		if_free(line);
		line = readline("> ");
		if (write(0, "\0", 1) == -1 && write(1, "\n", 1))
		{
			if_free(line);
			if (input)
				free_tab(input);
			return (NULL);
		}
		if (ft_strncmp(line, delimiter, ft_sublen(delimiter, '\0')))
			input = tabadd(input, line, 1, 0);
	}
	if_free(line);
	if (!input)
		return (tabadd(input, " ", 0, 0));
	return (input);
}

int	new_heredoc(t_cmd **cmd, size_t pos, size_t div, size_t div2)
{
	char	**input;
	int		fd[2];

	input = get_input((*cmd)->argv[pos + 2]);
	if (!input)
		return (1);
	dup2(fd[1], 1);
	pipe(fd);
	while (input && input[++div])
	{
		div2 = -1;
		while (input[div][++div2])
			write(fd[1], &input[div][div2], 1);
		write(fd[1], "\n", 1);
	}
	close (fd[1]);
	(*cmd)->fd[0] = fd[0];
	(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
	(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
	(*cmd)->argv = tabdelete((*cmd)->argv, pos, 1);
	if (input)
		free_tab(input);
	return (-3);
}
