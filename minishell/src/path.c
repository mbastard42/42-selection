/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   path.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 17:47:24 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 01:34:22 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

static char	**path_tab(char **tab)
{
	int		i;
	char	*tmp;
	char	**paths;

	i = -1;
	paths = NULL;
	if (!tab || !tab[0])
		return (NULL);
	while (tab[++i])
	{
		if (!ft_strncmp(tab[i], "PATH=", 5))
		{
			paths = ft_split_exept(tab[i], ":", "\'\"", 0);
			tmp = ft_substr(paths[0], 5, ft_sublen(tab[i], 0));
			free(paths[0]);
			paths[0] = tmp;
		}
	}
	return (paths);
}

int	check_paths(t_cmd *cmd, char **env)
{
	int		i;
	char	**paths;
	char	*arg;

	i = -1;
	paths = NULL;
	arg = NULL;
	if (cmd->path || cmd->argv[0][0] == '.')
		arg = ft_strjoin(cmd->path, cmd->argv[0], 0, 0);
	else
		paths = path_tab(env);
	while (paths && paths[++i] && access(arg, F_OK) == -1)
	{
		if_free(arg);
		arg = ft_strjoin(paths[i], ft_strjoin("/", cmd->argv[0], 0, 0), 0, 1);
	}
	free_tab(paths);
	if (access(arg, F_OK) != -1 && !opendir(arg))
	{
		if_free(cmd->argv[0]);
		cmd->argv[0] = arg;
		return (1);
	}
	if_free(arg);
	return (0);
}
