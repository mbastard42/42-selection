/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   expansions.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/14 20:30:31 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 19:40:19 by mbastard         ###   ########.fr       */
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

static char	*expend(char *token, size_t start, char *var)
{
	size_t	end;
	char	*expd;

	end = 1;
	if (token[start] == '$')
		end = 0;
	if (is_name(token[start + end], 1))
		while (is_name(token[start + end], 0))
			end++;
	if (token[start] == '$')
		end = 1;
	expd = ft_substr(token, 0, start - 1);
	if (var)
		expd = ft_strjoin(expd, var, 1, 1);
	if (token[start + end])
		expd = ft_strjoin(expd, &token[start + end], 1, 0);
	free(token);
	return (expd);
}

static char	*variables_expansions(t_data *data, char *token)
{
	size_t	i;
	char	in;
	char	*field;

	i = -1;
	in = 0;
	field = ft_strdup(token);
	while ((field[++i] == '$' && field[i + 1]) || field[i])
	{
		if (field[i] == in)
			in = 0;
		else if (in == 0 && ft_strchr("\'\"", field[i], 0))
			in = field[i];
		else if (field[i] == '$' && field[i + 1] == '$' && in != '\'')
			field = expend(field, i + 1, ft_itoa(getpid()));
		else if (field[i] == '$' && field[i + 1] == '?' && in != '\'')
			field = expend(field, i + 1, ft_itoa(data->status));
		else if (field[i] == '$' && is_name(field[i + 1], 1) && in != '\'')
			field = expend(field, i + 1, env_var(data->env, &field[i + 1]));
		else if (field[i] == '$' && is_alnum(field[i + 1], 0, 1) && in != '\'')
			field = ft_strcut(field, i, 2, 0);
	}
	free(token);
	return (field);
}

static char	*quotes_expansions(char *str, char *stop_chars, int clean)
{
	int		i;
	int		j;
	int		handle;
	char	*dst;

	i = -1;
	j = -1;
	handle = -1;
	dst = (char *)ft_calloc(ft_sublen(str, 0) + 1, sizeof(char));
	while (str[++i])
	{
		if (handle != -1 && str[i] == handle)
			handle = -1;
		else if (handle != -1)
			dst[++j] = str[i];
		else if (handle == -1 && ft_strchr(stop_chars, str[i], 0))
			break ;
		else if (handle == -1 && is_quotes(str[i]))
			handle = str[i];
		else if (handle == -1)
			dst[++j] = str[i];
	}
	if (clean)
		if_free(str);
	return (dst);
}

char	**expended(t_data *data, char **tokens, int clean)
{
	size_t	i;
	char	**field;

	i = -1;
	field = ft_tabdup(tokens, NULL);
	while (field && field[++i])
	{
		field[i] = variables_expansions(data, field[i]);
		field[i] = quotes_expansions(field[i], 0, 1);
	}
	if (clean)
		free_tab(tokens);
	return (field);
}
