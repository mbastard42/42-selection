/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   input.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/09 23:36:45 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 21:01:57 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static void	add_histo(char *cmd_tab, t_data *data)
{
	int	fd;

	if (cmd_tab && cmd_tab[0])
	{
		fd = open(data->histo_path, O_WRONLY | O_APPEND | O_CREAT, 0644);
		write(fd, cmd_tab, ft_sublen(cmd_tab, '\0'));
		write(fd, "\n", 1);
		add_history(cmd_tab);
		close(fd);
	}
}

static int	check_quotes(char *input)
{
	int		i;
	char	quotes;

	i = -1;
	quotes = 0;
	while (input && input[++i])
	{
		if (isin("\'\"", input[i]))
		{
			quotes = input[i];
			if (!input[i + 1])
				return (printf("mini: quotes are not balanced\n"));
			while (input[++i] != quotes && input[i])
				if (!input[i + 1])
					return (printf("mini: quotes are not balanced\n"));
			quotes = 0;
		}
	}
	return (0);
}

static int	token_syntax(char *in, size_t i)
{
	int	l;
	int	r;

	r = i + 1;
	l = i - 1;
	if (isin("><", in[i]) && in[i] == in[i + 1])
		r++;
	while (isin(" \t", in[r]))
		r++;
	while (l >= 0 && isin(" \t", in[l]))
		l--;
	if (isin("><", in[i]) && !in[r])
		return (printf("mini: syntax error near token `newline'\n"));
	if (in[i] == '|' && (!i || l < 0 || !in[r]))
		return (printf("mini: syntax error near token `|'\n"));
	if (isin("><", in[i]) && isin(">|<", in[r]) && in[r] != in[r + 1])
		return (printf("mini: syntax error near token `%c'\n", in[r]));
	if (isin("><", in[i]) && isin(">|<", in[r]) && in[r] == in[r + 1])
		return (printf("mini: syntax error near token `%c%c'\n", in[r], in[r]));
	return (0);
}

static int	check_input(char *input)
{
	size_t	i;
	char	in;

	i = -1;
	in = 0;
	while (input && input[++i])
	{
		if (input[i] == in)
			in = 0;
		else if (!in && input[i] && isin("\'\"", input[i]))
			in = input[i];
		else if (!in && input[i] && isin("|<>", input[i]))
		{
			printf(BRED);
			if (token_syntax(input, i))
				return (1);
			else if (input[i] == input[i + 1])
				i++;
		}
	}
	return (0);
}

char	*read_input(t_data *data)
{
	char	*input;

	printf(BWHT);
	input = readline("mini> ");
	if (write(0, "\0", 1) != -1 && !input)
	{
		write(1, "exit\n", 5);
		exiting(data, NULL);
	}
	add_histo(input, data);
	if (!check_quotes(input) && !check_input(input))
		return (input);
	data->status = 258;
	free(input);
	return (NULL);
}
