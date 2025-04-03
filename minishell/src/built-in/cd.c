/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd.c                                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 18:06:55 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 02:39:08 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static char	*env_var(char **env, char *token)
{
	size_t	i;
	size_t	end;
	char	*name;
	char	*var;

	i = -1;
	end = 0;
	var = NULL;
	if (is_name(token[end], 1))
		while (is_name(token[end], 0))
			end++;
	name = ft_substr(token, 0, end);
	while (env[++i])
	{
		if (!ft_strncmp(name, env[i], ft_sublen(name, 0)))
		{
			end = ft_sublen(env[i], 0) - ft_sublen(name, 0);
			var = ft_substr(env[i], ft_sublen(name, 0) + 1, end);
		}
	}
	free(name);
	return (var);
}

static char	**add_env(char **env, char *value)
{
	int	i;

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

int	replace_env(t_data *data, int old)
{
	char	*tmp;
	char	pwd[1028];

	getcwd(pwd, sizeof(pwd));
	if (!old)
		tmp = ft_strjoin("PWD=", pwd, 0, 0);
	else
		tmp = ft_strjoin("OLDPWD=", pwd, 0, 0);
	data->env = add_env(data->env, tmp);
	data->exp = add_env(data->exp, tmp);
	free(tmp);
	return (0);
}

int	cd(const char *path, t_data *data)
{
	char	*dir;

	dir = NULL;
	if (!path || ft_strchr(path, '~', 0))
		dir = env_var(data->env, "HOME");
	else if (!path || ft_strchr(path, '-', 0))
		dir = env_var(data->env, "OLDPWD");
	else if (access(path, F_OK) != -1)
		dir = ft_strdup(path);
	else
		return (write(1, "Folder doesn't exist\n", 21));
	replace_env(data, 1);
	chdir(dir);
	replace_env(data, 0);
	if (dir)
		free(dir);
	return (0);
}
