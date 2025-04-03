/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   export.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 18:08:42 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 04:22:12 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static char	**add_env(char **env, char *value)
{
	int		i;

	i = -1;
	while (env[++i])
	{
		if (!ft_strncmp(env[i], value, ft_sublen(value, '=')))
		{
			if (ft_strchr(value, '=', 0))
			{
				free(env[i]);
				env[i] = ft_strdup(value);
			}
			return (env);
		}
	}
	return (tabadd(env, value, 1, 0));
}

int	export(t_data *data, t_cmd *cmd)
{
	size_t	i;

	i = -1;
	if (!cmd->argv[1] && ft_tablen(data->exp, NULL))
	{
		ft_sort_by_ascii(data->exp);
		while (data->exp[++i])
			ft_fprintf(data->fd[1], "declare -x %s\n", data->exp[i]);
	}
	else if (cmd->argv[1])
	{
		i++;
		while (cmd->argv[++i])
		{
			if (is_strname(cmd->argv[i], '='))
			{
				if (ft_strchr(cmd->argv[i], '=', 0))
					data->env = add_env(data->env, cmd->argv[i]);
				data->exp = add_env(data->exp, cmd->argv[i]);
			}
			else
				ft_fprintf(data->fd[1], "%s: Invalid token !\n", cmd->argv[i]);
		}
	}
	return (0);
}
