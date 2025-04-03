/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   unset.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/19 02:00:29 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 02:47:22 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

char	**rm_env(char **env, char *name)
{
	int		i;
	int		j;
	char	**tmp;
	char	*token;

	i = -1;
	while (env[++i])
		;
	tmp = (char **)malloc(sizeof(char *) * (i + 1));
	i = -1;
	j = -1;
	token = ft_strjoin(name, "=", 0, 0);
	while (env[++i])
		if (ft_strncmp(env[i], name, ft_sublen(name, '\0')))
			tmp[++j] = ft_strdup(env[i]);
	free_tab(env);
	if_free(token);
	tmp[++j] = NULL;
	return (tmp);
}

int	unset(t_data *data, t_cmd *cmd)
{
	int		i;

	i = 0;
	if (!cmd->argv[1])
	{
		printf("unset: Too few arguments.\n");
		return (1);
	}
	while (cmd->argv[++i])
	{
		if (ft_strchr(cmd->argv[i], '=', 0) || !is_strname(cmd->argv[i], 0))
		{
			ft_fprintf(data->fd[1], "%s: Invalid argument.\n", cmd->argv[i]);
			return (1);
		}
		data->env = rm_env(data->env, cmd->argv[i]);
		data->exp = rm_env(data->exp, cmd->argv[i]);
	}
	return (0);
}
