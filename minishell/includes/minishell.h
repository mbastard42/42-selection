/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minishell.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/01 13:32:44 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:42:11 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MINISHELL_H

# define MINISHELL_H
# include <errno.h>
# include <fcntl.h>
# include <stdio.h>
# include <unistd.h>
# include <dirent.h>
# include <signal.h>
# include <stdarg.h>
# include <stdlib.h>
# include <string.h>
# include <locale.h>
# include <termios.h>
# include <sys/types.h>
# include <sys/select.h>
# include <readline/history.h>
# include <readline/readline.h>
# include "../libft/includes/libft.h"

# define BBLK "\e[1;30m"
# define BRED "\e[1;31m"
# define BGRN "\e[1;32m"
# define BYEL "\e[1;33m"
# define BBLU "\e[1;34m"
# define BMAG "\e[1;35m"
# define BCYN "\e[1;36m"
# define BWHT "\e[1;37m"

typedef struct s_cmd {
	int				fd[3];
	char			*path;
	char			**argv;
	struct s_cmd	*next;
}					t_cmd;

typedef struct s_data {
	int					fd[2];
	int					status;
	char				*histo_path;
	char				**env;
	char				**exp;
	t_cmd				*cmds;
	struct sigaction	sa;
}						t_data;

void	init_data(t_data *data, char **envp);

char	*read_input(t_data *data);
char	**lexer(char *input);
int		parser(t_data *data, char **tokens);

int		init_redirect(t_cmd *cmd);
int		new_heredoc(t_cmd **cmd, size_t pos, size_t div, size_t div2);
char	**expended(t_data *data, char **tokens, int clean);

t_cmd	*new_cmd(t_data *data, char **tab);
void	add_cmd(t_cmd **cmds, t_cmd *cmd);
void	del_cmds(t_cmd **cmds);

void	sig_hand(int sig);
void	show_ctrl(int hide);

int		launch_cmds(t_data *data, int *old_fd);

void	open_redirect(int fd0, int fd1);
void	close_redirect(int fd0, int fd1);

int		check_paths(t_cmd *cmd, char **env);

int		cd(const char *path, t_data *mini);
int		echo(char **argv);
int		export(t_data *data, t_cmd *cmd);
int		pwd(t_data *mini);
int		unset(t_data *data, t_cmd *cmd);
void	exiting(t_data *data, t_cmd *cmd);

char	**tabadd(char **tab, char *str, int clean, int clean_str);
char	**tabdelete(char **tab, size_t pos, int clean);
char	**ft_tabdup(char **tab, char *end);
char	*tabtostr(char **tab, int clean_tab);
void	print_tab(char **tab);
void	free_tab(char **tab);

char	**ft_split_exept(char *str, char *set, char *exept, int trim);

int		is_alnum(char c, int alpha, int num);
int		is_name(char c, int first);
int		is_strname(char *str, char end_char);
int		is_stralnum(char *str, int alpha, int num);
int		is_quotes(char c);

void	ft_sort_by_ascii(char **tab);
int		ft_chainlen(t_cmd *cmd);
void	if_free(void *mem);
int		isin(char *set, char c);

char	**tabjoin(char **t1, char **t2, int clean_t1, int clean_t2);

#endif
